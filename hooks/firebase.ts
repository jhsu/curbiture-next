import firebase from "firebase/app";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useGeofire } from "../components/firebase";
import { boundsAtom, locAtom, mapAtom } from "../store";

function debounce(callback: () => any, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback.apply(this, args), wait);
  };
}

function updateOrAdd<T extends { id: string }>(list: T[], item: T): T[] {
  let found = false;
  const updated = list.map((curr) => {
    if (curr.id === item.id) {
      found = true;
      return item;
    }
    return curr;
  });
  return found ? updated : [...updated, item];
}

export const useVisibleLocations = () => {
  const [, setLocations] = useAtom(locAtom);
  const [bounds] = useAtom(boundsAtom);

  // const [{ map: googlemap }] = useAtom(mapAtom);
  const geofire = useGeofire("posts_approved");

  // useEffect(() => {
  //   if (!googlemap) {
  //     return;
  //   }
  //   // TODO: how do we prevent flicker?
  //   // on bounds change, show search area button
  //   // const dbSetBounds = debounce(() => setBounds(googlemap.getBounds()), 750);
  //   // google.maps.event.addListener(googlemap, "bounds_changed", dbSetBounds);

  //   // return () => void google.maps.event.clearInstanceListeners(googlemap);
  // }, [googlemap]);

  // watch for location changes within query
  useEffect(() => {
    if (!bounds || !geofire) {
      return;
    }
    // TODO: how do we prevent flicker?
    setLocations([]);

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
    const cancel = query.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const doc = change.doc.data();
        switch (change.type) {
          case "added":
            // return addMarker(change.doc.id, change.doc.data());
            return setLocations((prev) => {
              return updateOrAdd(prev, {
                id: change.doc.id,
                name: doc.name,
                created_at: doc.created_at?.toDate() as Date,
                location: {
                  lat: doc.location?.latitude as number,
                  lng: doc.location?.longitude as number,
                },
                photo: doc.photo,
              });
            });
          case "modified":
          case "removed":
            console.log(doc);
            return setLocations((prev) => prev.filter((p) => p.id !== doc.id));
          default:
            break;
        }
      });
    });
    return cancel;
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
