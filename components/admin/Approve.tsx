import firebase from "firebase/app";
import "firebase/firestore";
import * as React from "react";
import { useCallback } from "react";
import { ItemLocation } from "../../store";
import Button from "../Button/Button";
import { useFirestore, useGeofire } from "../firebase";

export const Approve = ({ post }: { post: ItemLocation }) => {
  const db = useFirestore();
  const geoCollection = useGeofire("posts_approved");

  const approveDocument = useCallback(async () => {
    if (db) {
      try {
        // await db
        //   .collection("posts_approved")
        //   .doc(post.id)
        //   .set({
        //     name: post.name,
        //     photo: post.photo,
        //     location: new firebase.firestore.GeoPoint(
        //       post.location.lat,
        //       post.location.lng
        //     ),
        //     created_at: post.created_at,
        //     approved_at: new Date(),
        //     // available: true,
        //   });
        const geopoint = new firebase.firestore.GeoPoint(
          post.location.lat,
          post.location.lng
        );
        await geoCollection.doc(post.id).set({
          name: post.name,
          photo: post.photo,
          location: geopoint,
          created_at: post.created_at,
          approved_at: new Date(),
          // required by geofire:
          coordinates: geopoint,
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
