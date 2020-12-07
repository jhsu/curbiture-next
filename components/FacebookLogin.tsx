import firebase from "firebase/app";
import "firebase/auth";
import { useAtom } from "jotai";
import * as React from "react";
import { useCallback, useEffect, useMemo } from "react";
import { userAtom } from "../store";
import Button from "./Button/Button";

export const FacebookLogin = () => {
  const [, setUser] = useAtom(userAtom);

  useEffect(() => {
    const unsub = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return unsub;
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

  return <Button onClick={onLogin}>Login with Facebook</Button>;
};
