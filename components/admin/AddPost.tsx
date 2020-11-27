import firebase from "firebase/app";
import "firebase/firestore";
import { GoogleAPI, GoogleApiWrapper } from "google-maps-react";
import { useAtom } from "jotai";
import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { GOOGLE_KEY } from "../../google";
import { boundsAtom, createScopeAtom, selectedLocationAtom } from "../../store";
import Button from "../Button/Button";
import { useFireStorage, useFirestore } from "../firebase";

const PhotoPreview = ({ file }: { file: File }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (imgRef.current && e.target) {
        imgRef.current.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  }, [file]);
  return <img style={{ width: "100%" }} ref={imgRef} alt="preview" />;
};

const geocodeLocation = async (
  geocoder: google.maps.Geocoder,
  {
    address,
    bounds,
  }: {
    address: string;
    bounds: google.maps.LatLngBounds;
  }
) => {
  return new Promise<google.maps.LatLng>((resolve, reject) => {
    geocoder.geocode(
      {
        address,
        bounds,
      },
      (results, status) => {
        if (status === "OK") {
          const loc = results[0].geometry.location;
          resolve(loc);
        } else {
          reject(status);
        }
      }
    );
  });
};

interface LocationInputProps {
  google: GoogleAPI;
}
const LocationInput = ({ google }: LocationInputProps) => {
  const db = useFirestore();
  const storage = useFireStorage();
  const [bounds] = useAtom(boundsAtom);
  const [createCollection] = useAtom(createScopeAtom);
  const [, setActiveLocation] = useAtom(selectedLocationAtom);

  const geocoder = useMemo(() => google && new google.maps.Geocoder(), [
    google,
  ]);

  const [formError, setFormError] = useState<Error | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { isSubmitting },
  } = useForm();

  const photo = watch("photo");

  const onSubmit = useCallback(
    async ({ address, name, photo }) => {
      if (db && google && storage) {
        try {
          const loc = await geocodeLocation(geocoder, {
            address,
            bounds,
          });
          let url: string | null = null;
          let photoPath: string;
          if (photo && photo[0]) {
            const file = photo[0];
            // upload photo
            const metadata = {
              contentType: file.type,
            };
            try {
              // TODO: need to generate a unique name
              const snapshot = await storage
                .child(`posts/${file.name}`)
                .put(file, metadata);
              photoPath = snapshot.ref.fullPath;
              url = await snapshot.ref.getDownloadURL();
            } catch (err) {
              setError("photo", {
                type: "manual",
                message: err.message,
              });
            }
          }

          try {
            const key = `${loc.toString()}-${new Date().getTime()}`;
            const timestamp = new Date();
            await db
              .collection(createCollection)
              .doc(key)
              .set({
                name,
                created_at: timestamp,
                address,
                location: new firebase.firestore.GeoPoint(loc.lat(), loc.lng()),
                photo: url,
                photo_path: photoPath,
              });
            // setActiveLocation(key);
            reset();
          } catch (err) {
            // failed to update firestore
          }
        } catch (err) {
          // TODO: handle error
          console.error("failed to geocode location");
        }
      }
    },
    [
      createCollection,
      db,
      geocoder,
      google,
      bounds,
      reset,
      setError,
      setActiveLocation,
      storage,
    ]
  );

  // TODO: on address change, show preview marker
  // TODO: add a debounce on Change to search and view the location
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-6 py-4 px-3 pb-24">
      {formError && <div>{formError.message}</div>}
      <div className="flex flex-col mb-4">
        <label htmlFor="post_photo" className="field-label">
          photo
        </label>
        <input
          id="post_photo"
          name="photo"
          disabled={isSubmitting}
          ref={register()}
          type="file"
          accept="image/*;capture=camera"
          className="field"
        />
      </div>
      {photo && photo.length > 0 && <PhotoPreview file={photo?.[0]} />}
      <div className="flex flex-col mb-4">
        <label htmlFor="post_name" className="field-label">
          description
        </label>
        <input
          id="post_name"
          disabled={isSubmitting}
          ref={register({ required: true })}
          name="name"
          placeholder="name"
          required
          className="field"
        />
      </div>
      <div className="flex flex-col mb-4">
        <label htmlFor="post_address" className="field-label">
          location
        </label>
        <input
          id="post_address"
          disabled={isSubmitting}
          name="address"
          ref={register({ required: true })}
          placeholder="address"
          required
          className="field"
        />
      </div>
      <div>
        <Button primary disabled={isSubmitting} type="submit">
          add
        </Button>
      </div>
    </form>
  );
};

export const AddPosting = GoogleApiWrapper({
  apiKey: GOOGLE_KEY,
})(LocationInput);
