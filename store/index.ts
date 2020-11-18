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
export const boundsAtom = atom<{ sw: LatLngLiteral; ne: LatLngLiteral }>({
  sw: {
    lat: 0,
    lng: 0
  },
  ne: {
    lat: 0,
    lng: 0
  }
});

export const selectedLocationAtom = atom<
  string | null,
  (id: string | null) => void
>(null);
