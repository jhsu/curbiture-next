import "firebase/firestore";

import { useAtom } from "jotai";
import { useRouter } from "next/router";
import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { createScopeAtom, currentUserAtom, showAddPostAtom } from "../../store";
import Button from "../Button/Button";
import { useFireStorage, useFirestore } from "../firebase";

import PostPreview from "components/Mapper/PostPreview";
import { debounce } from "components/utils/utils";

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
  return (
    <img
      className="my-4 m-auto"
      style={{ maxHeight: 100 }}
      ref={imgRef}
      alt="preview"
    />
  );
};

// TODO: a better animation
const DroppingOff = () => {
  return <div>Submitting</div>;
};

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

const AddPost = () => {
  const router = useRouter();
  const db = useFirestore();
  const storage = useFireStorage();
  const [currentUser] = useAtom(currentUserAtom);
  const [createCollection] = useAtom(createScopeAtom);

  const [, setShowAddPost] = useAtom(showAddPostAtom);
  const [goog, setGoogleMap] = useState<{ map: any; maps: any }>();
  const onGoogleApiLoaded = useCallback((google) => {
    setGoogleMap(google);
  }, []);

  const geocoder = useMemo(() => goog && new google.maps.Geocoder(), [goog]);

  const [formError] = useState<Error | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    control,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      address: "",
      photo: null,
    },
  });
  const photo = watch("photo") as FileList | null;
  const bounds = useMemo(() => {
    if (goog) {
      return new google.maps.LatLngBounds(
        new google.maps.LatLng(40.486177, -74.265053),
        new google.maps.LatLng(41.377715, -71.761065)
      );
    }
  }, [goog]);

  const onSubmit = useCallback(
    async ({
      address,
      name,
      photo,
    }: {
      address: string;
      name: string;
      photo: FileList;
    }) => {
      if (db && geocoder && storage && currentUser) {
        // const key = translator.new();
        try {
          const loc = await geocodeLocation(geocoder, {
            address,
            bounds,
          });

          const idToken = await currentUser?.getIdToken();
          const headers = {
            Authorization: `bearer ${idToken}`,
            Accept: "application/json",
          };

          if (photo && photo[0]) {
            // upload photo
            const file = photo[0];
            const formData = new FormData();
            formData.append("photo", file);
            formData.append("name", name);
            formData.append("address", address);
            formData.append("location[latitude]", loc.lat().toString());
            formData.append("location[longitude]", loc.lng().toString());
            await fetch("/api/posts", {
              method: "POST",
              headers,
              body: formData,
            }).then((res) => res.json());
          }
          router.push("/map");
        } catch (err) {
          // TODO: handle error
          console.error("failed to geocode location");
        }
        reset();
      }
    },
    [
      currentUser,
      createCollection,
      db,
      geocoder,
      goog,
      reset,
      setError,
      storage,
      router,
    ]
  );

  const [loc, setLoc] = useState<google.maps.LatLng | null>(null);
  const onAddressChangeDb = useMemo(
    () =>
      debounce(
        (
          ...args: [
            google.maps.Geocoder,
            { address: string; bounds: google.maps.LatLngBounds }
          ]
        ) => {
          const [, { address }] = args;
          if (address && address !== "") {
            geocodeLocation(...args).then((loc) => setLoc(loc));
          } else {
            setLoc(null);
          }
        },
        500
      ),
    [goog, geocodeLocation]
  );

  return (
    <div className="flex flex-col h-full">
      {isSubmitting ? (
        <DroppingOff />
      ) : (
        <div className="px-3 flex-1 h-full pb-4 overflow-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            {formError && <div>{formError.message}</div>}
            <fieldset disabled={isSubmitting}>
              <div className="flex flex-col mb-4">
                <h2 className="mt-2">Post your latest find</h2>
                <input
                  id="post_photo"
                  name="photo"
                  disabled={isSubmitting}
                  ref={register}
                  type="file"
                  accept="image/*;capture=camera"
                  className="hidden"
                />
                {photo && photo.length > 0 ? (
                  <div className="text-center">
                    <PhotoPreview file={photo?.[0]} />
                  </div>
                ) : (
                  <label
                    htmlFor="post_photo"
                    className="relative text-center cursor-pointer"
                    tabIndex={0}
                  >
                    <div className="border-green-500 border-4 border-dashed bg-green-100 rounded-md p-4 py-8 mt-8">
                      <h3>Photo</h3>
                      <p>Tap here to select a photo.</p>
                    </div>
                  </label>
                )}
              </div>
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
                <Controller
                  control={control}
                  name="address"
                  rules={{ required: true }}
                  render={({ name, ref, onChange, onBlur }) => (
                    <input
                      id="post_address"
                      disabled={isSubmitting}
                      name={name}
                      ref={ref}
                      placeholder="address"
                      required
                      className="field"
                      onFocus={(e) => {
                        e.target.scrollIntoView();
                      }}
                      onChange={(e) => {
                        onChange(e);
                        onAddressChangeDb(geocoder, {
                          address: e.target.value,
                          // TODO: use city/region bounds
                          // bounds,
                        });
                      }}
                      onBlur={onBlur}
                    />
                  )}
                ></Controller>
              </div>
              <div className="mb-2 flex flex-row">
                <span className="flex-1">
                  <Button primary disabled={isSubmitting} type="submit">
                    Submit
                  </Button>
                </span>
                <Button onClick={() => void setShowAddPost(false)}>
                  <a>cancel</a>
                </Button>
              </div>
            </fieldset>
          </form>
          <div className="mb-4" style={{ height: 200 }}>
            <PostPreview
              height={200}
              marker={loc}
              onGoogleReady={onGoogleApiLoaded}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPost;
