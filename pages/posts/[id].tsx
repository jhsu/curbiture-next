import { useFirestore } from "components/firebase";
import { useRouter } from "next/router";

import { motion } from "framer-motion";
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
import { useStorageUrl } from "hooks/firebase";

const ShowPost = () => {
  const store = useFirestore();
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<ItemLocation | null>(null);
  const [, setBottomNav] = useAtom(bottomNavAtom);
  const [error, setError] = useState<Error>();
  const [, setSelectedPost] = useAtom(updateSelectedPostAtom);
  const [, setViewScope] = useAtom(activeView);

  const photoUrl = useStorageUrl(post?.photo_path);

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
      <motion.div layoutId="post-details" className="w-full h-full">
        <motion.div>
          <h2>Item is no longer found.</h2>
          <p>The item you are looking for has been taken by the internet.</p>
          <p>Posts on Curbiture only last for 24 hours.</p>
          <p>
            <Link href="/map">Go back and keep looking.</Link>
          </p>
          <p>Don't forget to share items you come across!</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layoutId="post-details"
      className="flex-1 bg-gray-200 overflow-auto"
    >
      <div className="flex flex-row items-center pr-2">
        <h2 className="flex-1 px-2">{post?.name}</h2>
        <Link href="/map">
          <Button icon>
            <CloseIcon label="Close" />
          </Button>
        </Link>
      </div>
      {post && (
        <>
          {photoUrl && <img src={photoUrl} alt={post.name} width="100%" />}
          <div>
            <p>{post.address}</p>
            <Button onClick={onViewOnMap}>
              <MapIcon label="View on Map" size="m" />
            </Button>
          </div>
        </>
      )}
    </motion.div>
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
