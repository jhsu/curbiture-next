import * as React from "react";

interface FileUploadProps extends React.ComponentPropsWithoutRef<"input"> {
  onPick(): void;
  register(options?: Record<string, any>): React.Ref<any>;
}
export const FileUpload = ({
  onPick,
  register,
  ...inputProps
}: FileUploadProps) => {
  return (
    <div>
      <input
        {...inputProps}
        ref={register()}
        name="photo"
        type="file"
        accept="image/*;capture=camera"
      />
    </div>
  );
};
