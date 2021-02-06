import Link from "next/link";
import { ItemLocation } from "store";
import { useStorageUrl } from "hooks/firebase";

const PostInfo = ({ post }: { post: ItemLocation }) => {
  const photoUrl = useStorageUrl(post.photo_path);

  return (
    <div>
      <h2>{post.name}</h2>
      {photoUrl && (
        <Link href={`/posts/${post.id}`}>
          <img src={photoUrl} style={{ maxWidth: "100%" }} title={post.name} />
        </Link>
      )}
    </div>
  );
};
export default PostInfo;
