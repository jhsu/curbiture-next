import * as React from "react";

import classnames from "classnames";
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
  return (
    <div
      key={post.id}
      className={classnames(
        "posts-item",
        "cursor-pointer flex flex-row",
        "p-4 border-b-2"
      )}
      onClick={() => onViewDetails(post)}
    >
      {post.photo && (
        <div className="w-10 float-left mr-1">
          <img src={post.photo} alt={post.name} width="100%" />
        </div>
      )}
      <div className="flex-1 p-1">
        <div className="flex flex-row">
          <div className="flex-1">
            <h2 className="heading">{post.name}</h2>
          </div>
          <div>
            <Button onClick={() => onViewOnMap(post)}>
              <MapIcon size="m" />
            </Button>
          </div>
        </div>
      </div>
      {approving && (
        <div className="p-1">
          <Approve post={post} />
        </div>
      )}
    </div>
  );
};
