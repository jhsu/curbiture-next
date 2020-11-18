import * as React from "react";

import { useContext, useMemo, useState } from "react";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseContext = React.createContext<firebase.app.App | null>(null);

const Provider = firebaseContext.Provider;

export const useFirestore = () => {
  const firebase = useContext(firebaseContext);
  return firebase?.firestore();
};
export const FirebaseProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [fbase, setFirebase] = useState<firebase.app.App | null>(null);
  useMemo(() => {
    if (!firebase.apps.length) {
      const app = firebase.initializeApp({
        apiKey: "AIzaSyDbMz51a7Vtz3af19vJxcol6cMucQ2EDcg",
        authDomain: "stoob-queue.firebaseapp.com",
        databaseURL: "https://stoob-queue.firebaseio.com",
        projectId: "stoob-queue",
        storageBucket: "stoob-queue.appspot.com",
        messagingSenderId: "152274101619",
        appId: "1:152274101619:web:72a0099225cf9363ba1106"
      });
      setFirebase(app);
    } else {
    }
  }, []);

  return <Provider value={fbase}>{children}</Provider>;
};
