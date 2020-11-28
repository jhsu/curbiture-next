import * as React from "react";
import { useCallback } from "react";
import { useAtom } from "jotai";

import { useIsAdmin } from "../hooks/auth";
import { ItemLocation, locAtom, viewScopeAtom, viewOnMapAtom } from "../store";

import Button from "./Button/Button";
import { PostItem } from "./PostItem";
import { PostsBacklog } from "./PostsBacklog";
import { CloseIcon } from "./SvgIcon";

export const Posts = () => {
  const [approvedPosts] = useAtom(locAtom);
  const [viewingScope, setViewScope] = useAtom(viewScopeAtom);
  const [, viewOnMap] = useAtom(viewOnMapAtom);
  const [viewingPost, setViewItem] = React.useState<ItemLocation>(null);

  const isAdmin = useIsAdmin();

  const onChangeScope = useCallback((e) => void setViewScope(e.target.value), [
    setViewScope,
  ]);

  const closeDetails = useCallback(() => void setViewItem(null), [setViewItem]);

  const approving = viewingScope === "posts_pending";

  return (
    <div className="flex flex-col flex-1 relative overflow-auto">
      {viewingPost && (
        <div className="absolute w-full h-full mb-16 bg-gray-200">
          <div className="flex flex-row items-center pr-2">
            <h2 className="flex-1 px-2">{viewingPost.name}</h2>
            <Button icon onClick={closeDetails}>
              <CloseIcon />
            </Button>
          </div>
          {viewingPost.photo && (
            <img src={viewingPost.photo} alt={viewingPost.name} width="100%" />
          )}
          <p>{viewingPost.address}</p>
        </div>
      )}

      <div className="flex-1 overflow-auto pb-16">
        <header className="p-2">
          <h2 className="heading">A curb near you.</h2>
          <p>view nearby finds.</p>

          {isAdmin && (
            <select value={viewingScope} onChange={onChangeScope}>
              <option value="posts_pending">pending</option>
              <option value="posts_approved">approved</option>
            </select>
          )}
        </header>
        <div className="flex flex-col posts-list">
          {approving ? (
            <PostsBacklog onSelectPost={setViewItem} />
          ) : (
            <>
              {approvedPosts.length === 0 && <div>No posts</div>}
              {approvedPosts.map((post) => {
                return (
                  <PostItem
                    key={post.id}
                    post={post}
                    onViewOnMap={viewOnMap}
                    onViewDetails={setViewItem}
                  />
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
