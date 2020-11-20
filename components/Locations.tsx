import * as React from "react";
import { useCallback } from "react";
import { useAtom } from "jotai";
import classnames from "classnames";

import { locAtom, viewScopeAtom, selectedLocationAtom } from "../store";

import { useIsAdmin } from "../hooks/auth";

import { Approve } from "./admin/Approve";

export const Locations = () => {
  const [locations] = useAtom(locAtom);
  const [viewingScope, setViewScope] = useAtom(viewScopeAtom);
  const [selectedId, selectLocation] = useAtom(selectedLocationAtom);
  const isAdmin = useIsAdmin();

  const onChangeScope = useCallback((e) => void setViewScope(e.target.value), [
    setViewScope,
  ]);
  const approving = viewingScope === "posts_pending";
  return (
    <div className="flex flex-col flex-1">
      {isAdmin && (
        <select value={viewingScope} onChange={onChangeScope}>
          <option value="posts_pending">pending</option>
          <option value="posts_approved">approved</option>
        </select>
      )}

      <div className="flex-1 flex flex-col">
        <h2 className="heading">A curb near you.</h2>
        {locations.length === 0 && <div>No posts</div>}
        <div className="flex flex-1 flex-wrap">
          {locations.map((loc) => {
            const active = selectedId === loc.id;
            return (
              <div
                key={loc.id}
                className={classnames(
                  {
                    "location-active": active,
                    "location-inactive": !active,
                  },
                  "w-full max-w-1/2 md:max-w-full md:w-full",
                  "cursor-pointer overflow-auto flex flex-row",
                  "location-item hover:location-active"
                )}
                onClick={() => selectLocation(loc.id)}
              >
                {loc.photo && (
                  <div className="w-10 float-left mr-1">
                    <img src={loc.photo} alt={loc.name} width="100%" />
                  </div>
                )}
                <div className="flex-1 p-1">{loc.name}</div>
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
