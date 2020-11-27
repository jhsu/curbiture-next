import { atom } from "jotai";
import { WritableAtom } from "jotai/core/types";

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

export const userAtom: WritableAtom<User, User> = atom<User, User | null>(null);
export const isAdminAtom = atom<boolean>(false);

export const locAtom = atom<ItemLocation[]>([]);
export const unapprovedPosts = atom<ItemLocation[]>([]);
export const boundsAtom: WritableAtom<
  google.maps.LatLngBounds,
  google.maps.LatLngBounds
> = atom<google.maps.LatLngBounds | null>(null);

export const selectedLocationAtom: WritableAtom<
  string | null,
  string | null
> = atom<string, string>(null);

export const clearPostSelection = atom(
  (get) => get(selectedLocationAtom),
  (_get, set) => {
    set(selectedLocationAtom, null);
  }
);

export const activeView = atom<"map" | "add-post" | "list">("list");

export const mapAtom = atom<{ map: google.maps.Map }>({ map: null });

export const viewOnMapAtom = atom(null, (get, set, postId: string) => {
  set(activeView, "map");
  set(selectedLocationAtom, postId);
});
