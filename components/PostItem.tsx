import * as React from "react";
import { useCallback } from "react";

import { ItemLocation } from "../store";
import Button from "./Button/Button";
import { MapIcon } from "./SvgIcon";
import { Approve } from "./admin/Approve";

interface PostItemProps {
  post: ItemLocation;
  approving?: boolean;
  onViewOnMap: (post: ItemLocation) => void;
  onViewDetails: (post: ItemLocation) => void;
}
export const PostItem = ({
  post,
  approving,
  onViewOnMap,
  onViewDetails,
}: PostItemProps) => {
  const onClick = useCallback(() => void onViewDetails(post), [post]);
  return (
    <div
      key={post.id}
      className="posts-item cursor-pointer p-4 border-b-2 flex flex-row"
    >
      <div onClick={onClick} className="flex flex-row flex-1">
        {post.photo && (
          <div className="w-10 float-left mr-1">
            <img src={post.photo} alt={post.name} width="100%" />
          </div>
        )}
        <div className="flex-1">
          <h2 className="heading">{post.name}</h2>
          <p className="text-sm">{post.address || "Unknown address."}</p>
        </div>
      </div>
      <div className="flex flex-row items-center">
        <Button onClick={() => onViewOnMap(post)}>
          <MapIcon size="m" />
        </Button>
        {approving && <Approve className="ml-1" post={post} />}
      </div>
    </div>
  );
};
