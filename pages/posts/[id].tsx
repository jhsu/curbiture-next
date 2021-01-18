import { useFirestore } from "components/firebase";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import {
  activeView,
  bottomNavAtom,
  ItemLocation,
  updateSelectedPostAtom,
} from "store";

import firebase from "firebase/app";
import "firebase/firestore";
import Button from "components/Button/Button";
import { CloseIcon, MapIcon } from "components/SvgIcon";
import Link from "next/link";
import { useAtom } from "jotai";

const ShowPost = () => {
  const store = useFirestore();
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<ItemLocation | null>(null);
  const [, setBottomNav] = useAtom(bottomNavAtom);
  const [error, setError] = useState<Error>();
  const [, setSelectedPost] = useAtom(updateSelectedPostAtom);
  const [, setViewScope] = useAtom(activeView);

  useEffect(() => {
    setBottomNav({
      showActions: false,
    });

    return () => void setBottomNav({ showActions: true });
  }, []);

  useEffect(() => {
    if (!store) {
      return;
    }
    if (id) {
      const docRef = store.collection("posts_approved").doc(id as string);
      docRef
        .get()
        .then((doc) => {
          const data = doc.data();
          if (doc.exists && data) {
            const location = data.location as firebase.firestore.GeoPoint;
            setPost({
              id: doc.id,
              name: data.name,
              created_at: data.created_at,
              address: data.address,
              location: {
                lat: location.latitude,
                lng: location.longitude,
              },
              photo_path: data.photo_path,
              photo: data.photo,
            });
          } else {
            throw new Error("Document not found");
          }
        })
        .catch((err) => {
          setError(err);
          // router.push("/");
        });
    }
  }, [store, id]);

  const onViewOnMap = useCallback(() => {
    setSelectedPost(post);
    setViewScope("map");
    router.push("/");
  }, [post]);

  if (error) {
    return (
      <div className="w-full h-full">
        <h2>Unable to find post.</h2>
        <Link href="/">Go home and see other posts.</Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-200 overflow-auto">
      <div className="flex flex-row items-center pr-2">
        <h2 className="flex-1 px-2">{post?.name}</h2>
        <Link href="/">
          <Button icon>
            <CloseIcon label="Close" />
          </Button>
        </Link>
      </div>
      {post && (
        <>
          {post.photo && <img src={post.photo} alt={post.name} width="100%" />}
          <div>
            <p>{post.address}</p>
            <Button onClick={onViewOnMap}>
              <MapIcon label="View on Map" size="m" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
export default ShowPost;

// export const getServerSideProps = (context) => {
//   return {
//     props: {
//       id: context.query.id,
//     },
//   };
// };
