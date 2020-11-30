import * as React from "react";
import { ItemLocation } from "../../store";

interface ItemInfoProps {
  post: ItemLocation;
  onViewDetails(post: ItemLocation): void;
}
export const ItemInfo = ({ post, onViewDetails }: ItemInfoProps) => {
  return (
    <div onClick={() => void onViewDetails(post)}>
      <h2>{post?.name}</h2>
      <div>
        {post?.photo ? (
          <img width={120} src={post?.photo} alt="item" />
        ) : (
          <div>photo</div>
        )}
      </div>
    </div>
  );
};
