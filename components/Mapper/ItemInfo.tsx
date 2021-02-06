import { useStorageUrl } from "hooks/firebase";
import * as React from "react";
import { ItemLocation } from "../../store";

interface ItemInfoProps {
  post: ItemLocation;
  onViewDetails(post: ItemLocation): void;
}
export const ItemInfo = ({ post, onViewDetails }: ItemInfoProps) => {
  const photoUrl = useStorageUrl(post.photo_path);
  return (
    <div className="pb-2" onClick={() => void onViewDetails(post)}>
      <h2>{post.name}</h2>
      <div>
        {photoUrl && <img width={120} src={photoUrl} alt="item" />}
        <p>{post.address}</p>
      </div>
    </div>
  );
};
