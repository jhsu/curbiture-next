import firebase from "firebase/app";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useGeofire } from "../components/firebase";
import { debounce } from "../components/utils/utils";
import { boundsAtom, loadingItemsAtom, locAtom } from "../store";

// function updateOrAdd<T extends { id: string }>(list: T[], item: T): T[] {
//   let found = false;
//   const updated = list.map((curr) => {
//     if (!found && curr.id === item.id) {
//       found = true;
//       return curr;
//     }
//     return curr;
//   });
//   return found ? updated : [...updated, item];
// }

export const useFirebaseAuth = () => {
  const auth = useMemo(() => firebase.auth(), [firebase]);
  return auth;
};

export const useVisibleLocations = () => {
  const [, setLocations] = useAtom(locAtom);
  const [, setLoading] = useAtom(loadingItemsAtom);
  const [bounds] = useAtom(boundsAtom);
  const geofire = useGeofire("posts_approved");

  const cancelSubscription = useRef<() => void>();

  const updateSubscription = useCallback(
    (bounds) => {
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
            created_at: doc.created_at?.toDate() as Date,
            location: {
              lat: doc.location?.latitude as number,
              lng: doc.location?.longitude as number,
            },
            photo: doc.photo,
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
    () => debounce(updateSubscription, 500),
    [updateSubscription]
  );

  // watch for location changes within query
  useEffect(() => {
    if (!bounds || !geofire) {
      return;
    }
    dbUpdateSubscription(bounds);
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
                      id: doc.id,
                      name: postDoc.name,
                      created_at: postDoc.created_at.toDate() as Date,
                      location: {
                        lat: postDoc.location?.latitude as number,
                        lng: postDoc.location?.longitude as number,
                      },
                      photo: postDoc.photo,
                      photo_path: postDoc.photo_path,
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
                  created_at: postDoc.created_at.toDate() as Date,
                  location: {
                    lat: postDoc.location?.latitude as number,
                    lng: postDoc.location?.longitude as number,
                  },
                  photo: postDoc.photo,
                  photo_path: postDoc.photo_path,
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
