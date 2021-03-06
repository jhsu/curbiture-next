import * as React from "react";
import { useCallback } from "react";
import { useAtom } from "jotai";

import { useIsAdmin } from "../hooks/auth";
import {
  locAtom,
  viewScopeAtom,
  viewOnMapAtom,
  updateSelectedPostAtom,
} from "../store";

import { PostItem } from "./PostItem";
import { PostsBacklog } from "./PostsBacklog";
import { useRouter } from "next/router";

export const Posts = () => {
  const router = useRouter();
  const [approvedPosts] = useAtom(locAtom);
  const [viewingScope, setViewScope] = useAtom(viewScopeAtom);
  const [, viewOnMap] = useAtom(viewOnMapAtom);
  const [, setViewItem] = useAtom(updateSelectedPostAtom);

  const isAdmin = useIsAdmin();

  const onChangeScope = useCallback((e) => void setViewScope(e.target.value), [
    setViewScope,
  ]);

  const approving = viewingScope === "posts_pending";

  return (
    <div className="flex flex-col flex-1 relative posts-container">
      {/* {viewingPost && (
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
          <div>
            <p>{viewingPost.address}</p>
            <Button onClick={() => viewOnMap(viewingPost)}>
              <MapIcon size="m" />
            </Button>
          </div>
        </div>
      )} */}

      <div className="flex-1 overflow-auto pb-16">
        <header className="p-2">
          {isAdmin && (
            <select
              value={viewingScope}
              onChange={onChangeScope}
              className="w-full h-8 text-lg border-2 border-gray-300"
            >
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
              {approvedPosts.length === 0 && (
                <div className="p-2">
                  <img src="/images/no-posts.svg" alt="no items found" />
                  <h2>There are items found.</h2>
                  <p>
                    Post an item to help others find what they are looking for!
                  </p>
                </div>
              )}
              {approvedPosts.map((post) => {
                return (
                  <PostItem
                    key={post.id}
                    post={post}
                    onViewOnMap={viewOnMap}
                    onViewDetails={(post) => {
                      router.push(`/posts/${post.id}`);
                    }}
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
