import { useFirestore } from "components/firebase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { bottomNavAtom, ItemLocation } from "store";

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

  useEffect(() => {
    setBottomNav({
      showActions: false,
    });

    return () => setBottomNav({ showActions: true });
  }, []);

  useEffect(() => {
    const docRef = store.collection("posts_approved").doc(id as string);
    docRef.get().then((doc) => {
      if (doc.exists) {
        const data = doc.data();
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
        // error loading
      }
    });
  }, [id]);

  return (
    <div className="w-full h-full mb-16 bg-gray-200">
      <div className="flex flex-row items-center pr-2">
        <h2 className="flex-1 px-2">{post?.name}</h2>
        <Link href="/">
          <Button icon>
            <CloseIcon />
          </Button>
        </Link>
      </div>
      {post && (
        <>
          {post.photo && <img src={post.photo} alt={post.name} width="100%" />}
          <div>
            <p>{post.address}</p>
            <Button>
              <MapIcon size="m" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
export default ShowPost;

export const getServerSideProps = (context) => {
  return {
    props: {
      id: context.query.id,
    },
  };
};
