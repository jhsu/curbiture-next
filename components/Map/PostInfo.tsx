import Link from "next/link";
import { ItemLocation } from "store";
import { useStorageUrl } from "hooks/firebase";
import { useMemo } from "react";
import { motion } from "framer-motion";

const PostInfo = ({ post }: { post: ItemLocation }) => {
  const photoUrl = useMemo(
    () => `https://photos.curbiture.app/${post.photo_path}`,
    [post.photo_path]
  );
  // const photoUrl = useStorageUrl(post.photo_path);

  return (
    <motion.div layoutId="post-details">
      <h2>{post.name}</h2>
      {photoUrl && (
        <Link href={`/posts/${post.id}`}>
          <img src={photoUrl} style={{ maxWidth: "100%" }} title={post.name} />
        </Link>
      )}
    </motion.div>
  );
};
export default PostInfo;
