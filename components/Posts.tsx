import classnames from "classnames";
import { useAtom } from "jotai";
import * as React from "react";
import { useCallback } from "react";
import { useIsAdmin } from "../hooks/auth";
import {
  activeView,
  locAtom,
  selectedLocationAtom,
  viewScopeAtom,
} from "../store";
import { Approve } from "./admin/Approve";
import Button from "./Button/Button";
import { MapIcon } from "./SvgIcon";

export const Posts = () => {
  const [posts] = useAtom(locAtom);
  const [viewingScope, setViewScope] = useAtom(viewScopeAtom);
  const [selectedId, selectLocation] = useAtom(selectedLocationAtom);
  const [, setView] = useAtom(activeView);
  const isAdmin = useIsAdmin();
  const [viewItemId, setViewItem] = React.useState<string>(null);

  const onSelectPost = useCallback(
    (postId: string) => {
      selectLocation(postId);
      setView("map");
    },
    [selectLocation, setView]
  );

  const onChangeScope = useCallback((e) => void setViewScope(e.target.value), [
    setViewScope,
  ]);

  const viewingPost = React.useMemo(
    () => posts.find((p) => p.id === viewItemId),
    [posts, viewItemId]
  );

  const closeDetails = useCallback(() => void setViewItem(null), [setViewItem]);

  const approving = viewingScope === "posts_pending";
  return (
    <div className="flex flex-col flex-1 relative overflow-hidden">
      {viewingPost && (
        <div className="absolute w-full h-full bg-gray-200">
          <h2>{viewingPost.name}</h2>
          <Button icon onClick={closeDetails}>
            X
          </Button>
          {viewingPost.photo && (
            <img src={viewingPost.photo} alt={viewingPost.name} width="100%" />
          )}
          <p>something</p>
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
        {posts.length === 0 && <div>No posts</div>}
        <div className="flex flex-col posts-list">
          {posts.map((loc) => {
            const active = selectedId === loc.id;
            return (
              <div
                key={loc.id}
                className={classnames(
                  "posts-item",
                  "cursor-pointer flex flex-row",
                  "p-4 border-b-2"
                )}
              >
                {loc.photo && (
                  <div className="w-10 float-left mr-1">
                    <img src={loc.photo} alt={loc.name} width="100%" />
                  </div>
                )}
                <div className="flex-1 p-1" onClick={() => setViewItem(loc.id)}>
                  <div className="flex flex-row">
                    <div className="flex-1">
                      <h2 className="heading">{loc.name}</h2>
                      <p>short info</p>
                    </div>
                    <div>
                      <Button onClick={() => onSelectPost(loc.id)}>
                        <MapIcon size="m" />
                      </Button>
                    </div>
                  </div>
                </div>
                {approving && (
                  <div className="p-1">
                    <Approve post={loc} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
