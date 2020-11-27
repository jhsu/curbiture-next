import * as React from "react";
import { useAtom } from "jotai";
import { ItemLocation, unapprovedPosts, viewOnMapAtom } from "../store";
import { useFirebaseLocations } from "../hooks/firebase";
import { useFirestore } from "./firebase";
import { PostItem } from "./PostItem";

export const PostsBacklog = ({
  onSelectPost,
}: {
  onSelectPost: (post: ItemLocation) => void;
}) => {
  const [posts, setPosts] = useAtom(unapprovedPosts);
  const [, viewOnMap] = useAtom(viewOnMapAtom);

  const db = useFirestore();
  useFirebaseLocations({ db, collection: "posts_pending" }, setPosts);

  return (
    <>
      <h2>Backlog</h2>
      {posts.map((post) => (
        <PostItem
          approving
          key={post.id}
          post={post}
          onViewDetails={onSelectPost}
          onViewOnMap={viewOnMap}
        />
      ))}
    </>
  );
};
