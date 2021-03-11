import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import algoliasearch from "algoliasearch";
import Image from "next/image";

import { useAtom } from "jotai";
import { useMachine } from "@xstate/react";
import { Machine } from "xstate";

import NewPost from "components/Posts/NewPost";
import Map from "components/Map/Map";
import SlidePanel from "components/SlidePanel/SlidePanel";
import Button from "components/Button/Button";
import { currentUserAtom } from "store";
import { useFirebaseUser } from "hooks/firebase";

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

interface Bounds {
  sw: { lat: number; lng: number };
  ne: { lat: number; lng: number };
}

const Page = () => {
  useFirebaseUser();
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const [posts, setPosts] = useState<SearchResult[]>([]);
  const [center, setCenter] = useState(defaultCenter);
  const [search, setSearch] = useState("");
  const [isSearching, setSearching] = useState(false);

  const [currentUser] = useAtom(currentUserAtom);

  const [formState, send] = useMachine(formMachine);

  useEffect(() => {
    (async () => {
      if (!bounds) {
        return;
      }
      setSearching(true);
      const locationParams = {
        insideBoundingBox: [
          [bounds.sw.lat, bounds.sw.lng, bounds.ne.lat, bounds.ne.lng],
        ] as readonly number[][],
      };
      const { hits } = await postsIndex.search(search, locationParams);
      setSearching(false);
      setPosts(hits as SearchResult[]);
    })();
  }, [search, bounds]);

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
    return posts.map((post) => ({
      id: post.objectID,
      name: post.name,
      created_at: new Date(),
      location: {
        lat: post.location.latitude,
        lng: post.location.longitude,
      },
    }));
  }, [posts]);

  const boundRef = useRef<NodeJS.Timeout>();
  const updateBounds = useMemo(() => {
    return (bounds) => {
      if (boundRef.current) {
        clearTimeout(boundRef.current);
      }
      boundRef.current = setTimeout(() => {
        setBounds(bounds);
      }, 160);
    };
  }, []);

  const onBoundsChange = useCallback(
    (bnds /*_zoom*/) => {
      updateBounds({ sw: bnds.sw, ne: bnds.ne });
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
      <div>
        <div>show logged in info or sign in</div>
        <Button onClick={onNewPost}>add post</Button>
        <div className="p-2">
          <input
            placeholder="Search for an item"
            onChange={onSearch}
            className="w-full p-2 border-2 border-gray-300 rounded-sm"
          />
          <div>
            <Image src="/images/algolia.svg" height={20} width={40} />
          </div>
        </div>
        <Button onClick={onUseLocation}>use my location</Button>
      </div>
      <div className="flex-1" style={{ height: 500 }}>
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
