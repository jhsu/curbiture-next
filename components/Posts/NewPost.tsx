import Button from "components/Button/Button";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import PhotoPreview from "./PhotoPreview";
/*
TODO: add geocoder
*/

interface NewPostProps {
  onCreated(data: any): void;
  onSubmit(data: any): void;
  onCancel?(): void;
}
const NewPost = ({ onSubmit, onCreated, onCancel }: NewPostProps) => {
  const { register, watch, handleSubmit } = useForm();
  const photo = watch("photo") as FileList | null;
  const onFormSubmit = useCallback(
    (data) => {
      onSubmit(data);
      // setTimeout(() => {
      //   onCreated(data);
      // }, 500);
    },
    [onSubmit]
  );
  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="p-4">
      new post
      <input
        name="photo"
        ref={register}
        type="file"
        accept="image/*;capture=camera"
      />
      {photo && photo.length > 0 && <PhotoPreview file={photo?.[0]} />}
      <input
        name="name"
        ref={register}
        type="text"
        inputMode="text"
        autoComplete="off"
      />
      <input
        name="address"
        ref={register}
        type="text"
        inputMode="text"
        autoComplete="street-address"
      />
      <Button type="submit">submit</Button>
      <Button onClick={onCancel}>cancel</Button>
    </form>
  );
};

export default NewPost;
