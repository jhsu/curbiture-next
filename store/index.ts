import { atom } from "jotai";
import firebase from "firebase";

export interface LatLngLiteral {
  lat: number;
  lng: number;
}

export interface ItemLocation {
  name: string;
  id: string;
  created_at: Date;
  location: LatLngLiteral;
  photo?: string;
  photo_path?: string;
  address?: string;
}

export interface User {
  uid: string;
  displayName: string | null;
}

// create
export const createScopeAtom = atom<string>("posts_pending");
export const viewScopeAtom = atom<string>("posts_approved");

// export const userAtom: WritableAtom<User, User> = atom<User, User | null>(null);
export const userAtom = atom<{ currentUser: firebase.User | null }>({
  currentUser: null,
});

export const currentUserAtom = atom(
  (get) => get(userAtom).currentUser,
  (get, set, user: firebase.User | null) => {
    set(userAtom, { ...get(userAtom), currentUser: user });
  }
);

export const isAdminAtom = atom<boolean>(false);
export const currentPositionAtom = atom<{
  location: google.maps.LatLngLiteral | null;
}>({
  location: null,
});

export const locAtom = atom<ItemLocation[]>([]);
locAtom.debugLabel = "Posts";

export const unapprovedPosts = atom<ItemLocation[]>([]);

export const mapAtom = atom<{
  bounds?: google.maps.LatLngBounds;
  center?: google.maps.LatLngLiteral;
  zoom?: number;
}>({
  bounds: undefined,
  center: undefined,
  zoom: undefined,
});

export const boundsAtom = atom(
  (get) => get(mapAtom).bounds,
  (get, set, bounds: google.maps.LatLngBounds) => {
    set(mapAtom, { ...get(mapAtom), bounds });
  }
);
boundsAtom.debugLabel = "Map Bounds";

export const loadingItemsAtom = atom(false);

export const selectedPostAtom = atom<{ post: ItemLocation | null }>({
  post: null,
});
selectedPostAtom.debugLabel = "Selected Post";

export const updateSelectedPostAtom = atom(
  (get) => get(selectedPostAtom).post,
  (_get, set, post: ItemLocation | null) => {
    set(selectedPostAtom, { post });
  }
);

export const clearPostSelection = atom(null, (_get, set) => {
  set(selectedPostAtom, { post: null });
});

export const showAddPostAtom = atom(false);

export type View = "map" | "list";
export const viewAtom = atom<View>("map");

export const activeView = atom(
  (get) => get(viewAtom),
  (_get, set, view: View) => {
    set(viewAtom, view);
    set(showAddPostAtom, false);
  }
);

export const viewOnMapAtom = atom(
  (get) => get(selectedPostAtom),
  (_get, set, post: ItemLocation | null) => {
    set(activeView, "map");
    set(selectedPostAtom, { post });
  }
);
viewOnMapAtom.debugLabel = "View Item on Map";

export const bottomNavAtom = atom({ showActions: true });
