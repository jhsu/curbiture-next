import Button from "components/Button/Button";
import PostPreview from "components/Mapper/PostPreview";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import PhotoPreview from "./PhotoPreview";
import { debounce } from "components/utils/utils";

/*
TODO: add geocoder
*/

const geocodeLocation = async (
  geocoder: google.maps.Geocoder,
  {
    address,
    bounds,
  }: {
    address: string;
    bounds?: google.maps.LatLngBounds;
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

interface NewPostProps {
  onCreated(data: any): void;
  onSubmit(data: any): void;
  onCancel?(): void;
}
const NewPost = ({ onSubmit, onCreated, onCancel }: NewPostProps) => {
  const [goog, setGoogleMap] = useState<{ map: any; maps: any }>();
  const onGoogleApiLoaded = useCallback((google) => {
    setGoogleMap(google);
  }, []);
  const [loc, setLoc] = useState<google.maps.LatLng | null>(null);

  const { register, watch, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      adddress: "",
      location: null,
      photo: null,
    },
  });
  const photo = watch("photo") as FileList | null;
  const address = watch("address");

  const onAddressChange = useMemo(
    () =>
      debounce(
        async (
          ...args: [
            google.maps.Geocoder,
            { address: string; bounds: google.maps.LatLngBounds }
          ]
        ) => {
          const [, { address }] = args;
          if (address && address !== "") {
            const loc = await geocodeLocation(...args);
            setLoc(loc);
          } else {
            setLoc(null);
          }
        },
        500
      ),
    [goog, geocodeLocation]
  );

  const geocoder = useMemo(() => goog && new google.maps.Geocoder(), [goog]);
  useEffect(() => {
    if (address !== "") {
      onAddressChange(geocoder, { address });
    }
  }, [address]);

  const onFormSubmit = useCallback(
    (data) => {
      onSubmit({ ...data, location: loc });
    },
    [loc, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="p-4">
      <h2>Share something you found</h2>
      <input
        name="name"
        ref={register}
        type="text"
        inputMode="text"
        autoComplete="off"
        placeholder="Enter a description"
        className="block w-full border-2 mb-2 p-2"
        required
      />
      <input
        name="address"
        ref={register}
        type="text"
        inputMode="text"
        autoComplete="street-address"
        placeholder="Location (eg 'W 43rd st and 6th ave')"
        className="block w-full border-2 mb-2 p-2"
        required
      />

      <PostPreview
        height={200}
        marker={loc}
        onGoogleReady={onGoogleApiLoaded}
      />
      <input
        name="photo"
        ref={register}
        type="file"
        accept="image/*;capture=camera"
        className="block w-full mb-2"
      />
      <div>{<PhotoPreview file={photo?.[0]} />}</div>
      <Button type="submit">submit</Button>
      <Button
        type="button"
        onClick={() => {
          reset();
          if (onCancel) {
            onCancel();
          }
        }}
      >
        cancel
      </Button>
    </form>
  );
};

export default NewPost;
