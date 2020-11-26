import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import * as geofire from "geofirestore";
import * as React from "react";
import { useContext } from "react";

const firebaseContext = React.createContext<firebase.app.App | null>(null);

const Provider = firebaseContext.Provider;

export const useGeofire = () => {
  const firestore = useFirestore();
  const geo = React.useMemo(() => geofire.initializeApp(firestore), [
    firestore,
  ]);
  return geo;
};

export const useFirestore = () => {
  const app = useContext(firebaseContext);
  return React.useMemo(() => app?.firestore(), [app]);
};

export const useFireStorage = () => {
  const app = useContext(firebaseContext);
  return React.useMemo(() => app.storage().ref(), [app]);
};

export const FirebaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const fbase = React.useMemo(() => {
    if (!firebase.apps.length) {
      const app = firebase.initializeApp({
        apiKey: "AIzaSyDbMz51a7Vtz3af19vJxcol6cMucQ2EDcg",
        authDomain: "stoob-queue.firebaseapp.com",
        databaseURL: "https://stoob-queue.firebaseio.com",
        projectId: "stoob-queue",
        storageBucket: "stoob-queue.appspot.com",
        messagingSenderId: "152274101619",
        appId: "1:152274101619:web:72a0099225cf9363ba1106",
      });
      return app;
    }
  }, []);

  return <Provider value={fbase}>{children}</Provider>;
};
