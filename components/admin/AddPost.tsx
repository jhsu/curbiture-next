import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAtom } from "jotai";
import { GoogleApiWrapper, GoogleAPI } from "google-maps-react";

import ReactFileStack, { client } from "filestack-react";
import { useForm } from "react-hook-form";

import firebase from "firebase/app";
import "firebase/firestore";
import { useFirestore } from "../firebase";
import { boundsAtom, createScopeAtom, selectedLocationAtom } from "../../store";

import { FileUpload } from "./FileUpload";

import { GOOGLE_KEY } from "../../google";

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
    bounds: { sw: google.maps.LatLngLiteral; ne: google.maps.LatLngLiteral };
  }
) => {
  return new Promise<google.maps.LatLng>((resolve, reject) => {
    geocoder.geocode(
      {
        address,
        bounds: new google.maps.LatLngBounds(bounds.sw, bounds.ne),
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

  const filestack = useMemo(() => client.init("AO3xHP0A7QmymMNANxlj4z"), []);
  const onSubmit = useCallback(
    async ({ address, name, photo }) => {
      if (db && google) {
        try {
          const loc = await geocodeLocation(geocoder, {
            address,
            bounds,
          });
          let url: string | null = null;
          if (photo && photo[0]) {
            // upload photo
            url = await filestack.upload(photo[0]).catch((err: Error) => {
              setError("photo", {
                type: "manual",
                message: err.message,
              });
            });
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
                location: new firebase.firestore.GeoPoint(loc.lat(), loc.lng()),
                photo: url,
              });
            setActiveLocation(key);
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
      filestack,
      createCollection,
      db,
      geocoder,
      google,
      bounds,
      reset,
      setError,
      setActiveLocation,
    ]
  );

  const FileWithRegister = useCallback(
    ({ onPick }) => (
      <FileUpload disabled={isSubmitting} onPick={onPick} register={register} />
    ),
    [register, isSubmitting]
  );

  // TODO: on address change, show preview marker

  // TODO: add a debounce on Change to search and view the location
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {formError && <div>{formError.message}</div>}
      <ReactFileStack
        apikey="AO3xHP0A7QmymMNANxlj4z"
        action="upload"
        onSuccess={console.log}
        file={photo}
        customRender={FileWithRegister}
      />
      {photo && photo.length > 0 && <PhotoPreview file={photo?.[0]} />}
      <input
        disabled={isSubmitting}
        ref={register({ required: true })}
        name="name"
        placeholder="name"
        required
      />
      <input
        disabled={isSubmitting}
        name="address"
        ref={register({ required: true })}
        placeholder="address"
        required
      />
      <button disabled={isSubmitting} type="submit">
        add
      </button>
    </form>
  );
};

export const AddPosting = GoogleApiWrapper({
  apiKey: GOOGLE_KEY,
})(LocationInput);
