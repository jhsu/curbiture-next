import { useAtom } from "jotai";
import { useEffect } from "react";
import { locAtom, viewScopeAtom } from "../store";
import firebase from "firebase/app";

export const useFirebaseLocations = ({
  db
}: {
  db?: firebase.firestore.Firestore | null;
}) => {
  const [, setLocations] = useAtom(locAtom);
  const [viewCollection] = useAtom(viewScopeAtom);
  useEffect(() => {
    if (!db) return;
    setLocations([]);
    db.collection(viewCollection)
      // order by ascending, reverse below so that newest always is first in state
      .orderBy("created_at", "asc")
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          const { doc } = change;
          if (change.type === "removed") {
            setLocations((prev) => prev.filter((il) => il.id !== doc.id));
          } else {
            setLocations((prev) => {
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
                        lng: postDoc.location?.longitude as number
                      },
                      photo: postDoc.photo
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
                    lng: postDoc.location?.longitude as number
                  },
                  photo: postDoc.photo
                };
                return [postData, ...prev];
              }
            });
          }
        });
      });
    return () => void setLocations([]);
  }, [db, viewCollection, setLocations]);
};
