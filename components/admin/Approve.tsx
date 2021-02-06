import firebase from "firebase/app";
import "firebase/firestore";
import * as React from "react";
import { useCallback } from "react";
import classnames from "classnames";
import { ItemLocation } from "../../store";
import Button from "../Button/Button";
import { useFirestore, useGeofire } from "../firebase";
import { TrashIcon } from "../SvgIcon";

export const Approve = ({
  className,
  post,
}: {
  post: ItemLocation;
  className?: string;
}) => {
  const db = useFirestore();
  const geoCollection = useGeofire("posts_approved");

  const approveDocument = useCallback(async () => {
    if (db && geoCollection) {
      try {
        const geopoint = new firebase.firestore.GeoPoint(
          post.location.lat,
          post.location.lng
        );
        await geoCollection.doc(post.id).set({
          name: post.name,
          photo_path: post.photo_path,
          location: geopoint,
          created_at: post.created_at,
          approved_at: new Date(),
          address: post.address,
          // required by geofire:
          coordinates: geopoint,
        });
      } catch (err) {
        console.error("failed to approve post", err);
        return err;
      }
      try {
        await db.collection("posts_pending").doc(post.id).delete();
      } catch (err) {
        // probably already removed
      }
    }
  }, [db, post]);

  const onRemovePost = useCallback(async () => {
    if (db && post) {
      try {
        await db.collection("posts_pending").doc(post.id).delete();
      } catch (err) {
        console.error(err);
      }
    }
  }, [db, post]);

  return (
    <>
      <Button
        className={classnames(className, "mr-1")}
        onClick={approveDocument}
      >
        approve
      </Button>
      <Button onClick={onRemovePost}>
        <TrashIcon label="Remove post" size="m" />
      </Button>
    </>
  );
};
