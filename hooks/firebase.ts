import firebase from "firebase/app";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGeofire } from "../components/firebase";
import { debounce } from "../components/utils/utils";
import {
  boundsAtom,
  currentUserAtom,
  loadingItemsAtom,
  locAtom,
} from "../store";

export const useFirebaseAuth = () => {
  const auth = useMemo(() => firebase.auth(), [firebase]);
  return auth;
};

export const useFirebaseUser = () => {
  const auth = useFirebaseAuth();
  const router = useRouter();
  const [currentUser, setUser] = useAtom(currentUserAtom);
  const [checkedUser, setCheckedUser] = useState(false);

  useEffect(() => {
    if (auth) {
      return auth.onAuthStateChanged((user) => {
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
        setCheckedUser(true);
      });
    }
  }, [auth, router]);
  return { user: currentUser, isReady: checkedUser };
};

export const useVisibleLocations = () => {
  const [, setLocations] = useAtom(locAtom);
  const [, setLoading] = useAtom(loadingItemsAtom);
  const [bounds] = useAtom(boundsAtom);
  const geofire = useGeofire("posts_approved");

  const cancelSubscription = useRef<() => void>();

  const updateSubscription = useCallback(
    (bounds: google.maps.LatLngBounds) => {
      if (!geofire || !google.maps?.geometry) {
        return;
      }
      setLoading(true);
      const center = bounds.getCenter();
      const ne = bounds.getNorthEast();
      const radius = google.maps.geometry.spherical.computeDistanceBetween(
        center,
        ne
      );
      const query = geofire.near({
        center: new firebase.firestore.GeoPoint(center.lat(), center.lng()),
        radius: radius / 1000, // km
      });

      if (cancelSubscription.current) {
        cancelSubscription.current();
      }

      // TODO: process changes more efficiently
      cancelSubscription.current = query.onSnapshot((snapshot) => {
        const data = snapshot.docChanges().map((change) => {
          const doc = change.doc.data();
          return {
            id: change.doc.id,
            name: doc.name,
            ...doc,
            created_at: doc.created_at?.toDate() as Date,
            location: {
              lat: doc.location?.latitude as number,
              lng: doc.location?.longitude as number,
            },
          };
        });
        setLocations(data);
        setLoading(false);
        // TODO: how do we handle future add
        snapshot.docChanges().forEach((change) => {
          switch (change.type) {
            //     case "modified":
            //     case "added":
            //       return setLocations((prev) => {
            //         // TODO: handle modified
            //         return updateOrAdd(prev, {
            //           id: change.doc.id,
            //           name: doc.name,
            //           created_at: doc.created_at?.toDate() as Date,
            //           location: {
            //             lat: doc.location?.latitude as number,
            //             lng: doc.location?.longitude as number,
            //           },
            //           photo: doc.photo,
            //         });
            //       });
            case "removed":
              return setLocations((prev) =>
                prev.filter((p) => p.id !== change.doc.id)
              );
            default:
              break;
          }
        });
      });
    },
    [geofire]
  );

  const dbUpdateSubscription = useMemo(
    () => debounce(updateSubscription, 400),
    [updateSubscription]
  );

  // watch for location changes within query
  useEffect(() => {
    if (!bounds || !geofire) {
      return;
    }
    dbUpdateSubscription(bounds);
    // TODO: cancel on unmount
  }, [bounds]);
};

export const useFirebaseLocations = (
  {
    db,
    collection,
  }: {
    db?: firebase.firestore.Firestore | null;
    collection: string;
  },
  set: (prev: any) => any
) => {
  useEffect(() => {
    if (!db) return;

    db.collection(collection)
      // order by ascending, reverse below so that newest always is first in state
      .orderBy("created_at", "asc")
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          const { doc } = change;
          if (change.type === "removed") {
            set((prev) => prev.filter((il) => il.id !== doc.id));
          } else {
            set((prev) => {
              if (prev.find((il) => il.id === doc.id)) {
                return prev.map((il) => {
                  if (il.id === doc.id) {
                    const postDoc = doc.data();
                    return {
                      ...il,
                      ...postDoc,
                      id: doc.id,
                      name: postDoc.name,
                      created_at: postDoc.created_at.toDate() as Date,
                      location: {
                        lat: postDoc.location?.latitude as number,
                        lng: postDoc.location?.longitude as number,
                      },
                    };
                  }
                  return il;
                });
              } else {
                const postDoc = doc.data();
                // put newly added first
                const postData = {
                  id: doc.id,
                  name: postDoc.name,
                  ...postDoc,
                  created_at: postDoc.created_at.toDate() as Date,
                  location: {
                    lat: postDoc.location?.latitude as number,
                    lng: postDoc.location?.longitude as number,
                  },
                };
                return [postData, ...prev];
              }
            });
          }
        });
      });
    // return () => void set([]);
  }, [db, collection, set]);
};
