import { useCallback, useMemo, useRef, useState } from "react";

import algoliasearch from "algoliasearch";
import Image from "next/image";

import { useAtom } from "jotai";
import { useMachine } from "@xstate/react";
import { Machine } from "xstate";

import NewPost from "components/Posts/NewPost";
import Map from "components/Map/Map";
import SlidePanel from "components/SlidePanel/SlidePanel";
import Button from "components/Button/Button";
import { boundsAtom, currentUserAtom } from "store";
import { useFirebaseUser, useVisibleLocations } from "hooks/firebase";
import { useQuery } from "react-query";
import googleMapReact from "google-map-react";
import { UserIcon } from "components/SvgIcon";
import Link from "next/link";
import LoginRedirectBack from "components/auth/LoginRedirectBack";
import SignOut from "components/auth/Signout";

const client = algoliasearch("ZOP008O4FG", "2a580969aa37bb644144759d157d8369");
const postsIndex = client.initIndex("prod_posts");

const formMachine = Machine({
  id: "map",
  initial: "map",
  states: {
    map: {
      on: { NEW_POST: "addPost", VIEW_POST: "viewPost" },
    },
    addPost: {
      on: { SUBMIT: "addingPost", CANCEL: "map", CREATED: "viewPost" },
    },
    addingPost: {
      on: {
        SUCCESS: "map",
        FAILURE: "addPost",
      },
    },
    viewPost: {
      on: {
        VIEW_ALL: "map",
      },
    },
  },
});

const defaultCenter = {
  lat: 40.75421,
  lng: -73.983534,
};

interface SearchResult {
  objectID: string;
  name: string;
  location: { latitude: number; longitude: number };
  photo_path: string;
}

async function loadMapPosts(
  bounds: google.maps.LatLngBounds | undefined,
  search: string
): Promise<SearchResult[] | undefined> {
  if (!bounds) {
    return;
  }
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  const locationParams = {
    insideBoundingBox: [
      [sw.lat(), sw.lng(), ne.lat(), ne.lng()],
    ] as readonly number[][],
  };
  const { hits } = await postsIndex.search(search, locationParams);
  return hits as SearchResult[];
}

const Page = () => {
  useFirebaseUser();
  const [bounds, setBounds] = useAtom(boundsAtom);
  const [center, setCenter] = useState(defaultCenter);
  const [search, setSearch] = useState("");

  const [currentUser] = useAtom(currentUserAtom);

  const [formState, send] = useMachine(formMachine);

  const { data: posts, refetch, isFetching: _isSearching } = useQuery<
    SearchResult[] | undefined,
    Error
  >(["map-posts", bounds, search], () => loadMapPosts(bounds, search), {
    placeholderData: [],
  });
  useVisibleLocations(refetch);

  const onUseLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // TODO: notify unable to get location
          // handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    }
  }, []);
  const markers = useMemo(() => {
    return (
      posts?.map((post) => ({
        id: post.objectID,
        name: post.name,
        created_at: new Date(),
        location: {
          lat: post.location.latitude,
          lng: post.location.longitude,
        },
      })) ?? []
    );
  }, [posts]);

  const boundRef = useRef<NodeJS.Timeout>();
  const updateBounds = useMemo(() => {
    return (bounds: googleMapReact.Bounds) => {
      if (boundRef.current) {
        clearTimeout(boundRef.current);
      }
      boundRef.current = setTimeout(() => {
        // setBounds(bounds);
        setBounds(new google.maps.LatLngBounds(bounds.sw, bounds.ne));
      }, 160);
    };
  }, []);

  const onBoundsChange = useCallback(
    (bnds: googleMapReact.Bounds /*_zoom*/) => {
      updateBounds(bnds);
      // updateBounds({ sw: bnds.sw, ne: bnds.ne });
    },
    [updateBounds]
  );

  const typing = useRef<NodeJS.Timeout>();

  const onSearch = useCallback((ev) => {
    if (typing.current) {
      clearTimeout(typing.current);
    }
    const value = ev.target.value;
    typing.current = setTimeout(() => {
      // TODO: check if mounted
      setSearch(value.trim());
    }, 250);
  }, []);

  const onNewPost = useCallback(() => send("NEW_POST"), [send]);
  const onCancelNewPost = useCallback(() => send("CANCEL"), [send]);
  const onCreatePost = useCallback(
    async ({
      name,
      photo,
      address,
      location,
    }: {
      name: string;
      photo: FileList;
      address: string;
      location: google.maps.LatLng;
    }) => {
      if (!currentUser) {
        return;
      }
      const idToken = await currentUser?.getIdToken();
      const headers = {
        Authorization: `bearer ${idToken}`,
        Accept: "application/json",
      };
      if (photo && photo[0]) {
        // upload photo
        const file = photo[0];
        const formData = new FormData();
        formData.append("photo", file);
        formData.append("name", name);
        formData.append("address", address);
        formData.append("location[latitude]", location.lat().toString());
        formData.append("location[longitude]", location.lng().toString());
        await fetch("/api/posts", {
          method: "POST",
          headers,
          body: formData,
        }).then((res) => res.json());
      }
      send("SUCCESS");
    },
    [currentUser]
  );

  return (
    <div className="h-full bg-white dark:bg-black flex flex-col overflow-hidden relative">
      <SlidePanel
        visible={
          formState.value === "addPost" || formState.value === "addingPost"
        }
        onClose={onCancelNewPost}
      >
        <NewPost
          onSubmit={(form) => {
            send("SUBMIT");
            onCreatePost(form);
          }}
          onCreated={(post) => {
            send("SUCCESS");
            console.log(post);
          }}
          onCancel={onCancelNewPost}
        />
      </SlidePanel>
      <div className="flex flex-row">
        <div>
          {currentUser ? (
            <>
              <Link href="/user/account">
                <Button>
                  <UserIcon label="Your Account" />
                </Button>
              </Link>
              <SignOut />
            </>
          ) : (
            <LoginRedirectBack>
              <Button>
                <UserIcon label="Login" />
              </Button>
            </LoginRedirectBack>
          )}
        </div>
        <div className="p-2 flex-1">
          <input
            placeholder="Search for an item"
            onChange={onSearch}
            className="w-full p-2 border-2 border-gray-300 rounded-sm"
          />
          <div>
            <Image src="/images/algolia.svg" height={20} width={40} />
          </div>
          <Button onClick={onUseLocation}>use my location</Button>
        </div>
      </div>
      <div className="relative flex-1" style={{ height: 500 }}>
        <div className="absolute z-10 bottom-10 right-0">
          <Button onClick={onNewPost}>add post</Button>
        </div>
        <Map
          center={center}
          markers={markers}
          onBoundsChange={onBoundsChange}
        />
      </div>
      {/* <div className="overflow-auto">
        {posts.map((post, idx) => {
          return <div key={idx}>{post.name}</div>;
        })}
      </div> */}
    </div>
  );
};

export default Page;
