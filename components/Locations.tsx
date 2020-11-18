import * as React from "react";
import { useCallback } from "react";
import { useAtom } from "jotai";

import { locAtom, viewScopeAtom, selectedLocationAtom } from "../store";

import { useIsAdmin } from "../hooks/auth";

import { Approve } from "./admin/Approve";

export const Locations = () => {
  const [locations] = useAtom(locAtom);
  const [viewingScope, setViewScope] = useAtom(viewScopeAtom);
  const [selectedId, selectLocation] = useAtom(selectedLocationAtom);
  const isAdmin = useIsAdmin();

  const onChangeScope = useCallback((e) => void setViewScope(e.target.value), [
    setViewScope
  ]);
  const approving = viewingScope === "posts_pending";
  return (
    <div>
      {isAdmin && (
        <select value={viewingScope} onChange={onChangeScope}>
          <option value="posts_pending">pending</option>
          <option value="posts_approved">approved</option>
        </select>
      )}

      <div>
        {locations.length === 0 && <div>No posts</div>}
        {locations.map((loc) => {
          return (
            <div key={loc.id} onClick={() => selectLocation(loc.id)}>
              {loc.photo && (
                <div>
                  <img src={loc.photo} alt={loc.name} height="80px" />
                </div>
              )}
              {loc.name}
              {approving && <Approve post={loc} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
