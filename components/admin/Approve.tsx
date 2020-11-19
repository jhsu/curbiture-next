import * as React from "react";
import { useCallback } from "react";
import firebase from "firebase/app";
import "firebase/firestore";

import { useFirestore } from "../firebase";
import { ItemLocation } from "../../store";
import Button from "../Button/Button";

export const Approve = ({ post }: { post: ItemLocation }) => {
  const db = useFirestore();
  const approveDocument = useCallback(async () => {
    if (db) {
      try {
        await db
          .collection("posts_approved")
          .doc(post.id)
          .set({
            name: post.name,
            photo: post.photo,
            location: new firebase.firestore.GeoPoint(
              post.location.lat,
              post.location.lng
            ),
            created_at: post.created_at,
            approved_at: new Date(),
            available: true
          });
      } catch (err) {
        console.error("failed to approve post");
        return err;
      }
      try {
        await db.collection("posts_pending").doc(post.id).delete();
      } catch (err) {
        // probably already removed
      }
    }
  }, [db, post]);
  return <Button onClick={approveDocument}>approve</Button>;
};
