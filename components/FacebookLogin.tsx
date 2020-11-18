import firebase from "firebase/app";
import "firebase/auth";
import * as React from "react";
import { useCallback, useEffect, useMemo } from "react";
import { useAtom } from "jotai";

import { userAtom } from "../store";

export const FacebookLogin = () => {
  // const [errors, setErrors] = useState(null);
  const [user, setUser] = useAtom(userAtom);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, [setUser]);

  const provider = useMemo(() => {
    const fb = new firebase.auth.FacebookAuthProvider();
    firebase.auth().useDeviceLanguage();
    return fb;
  }, []);

  const onLogin = useCallback(() => {
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        return firebase.auth().signInWithRedirect(provider);
      });
  }, [provider]);
  const onLogout = useCallback(() => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
      });
  }, [setUser]);

  return (
    <div>
      {user ? (
        <div>
          {user.displayName}
          <button onClick={onLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={onLogin}>Login with Facebook</button>
      )}
    </div>
  );
};
