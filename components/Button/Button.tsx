import React from "react";
import classnames from "classnames";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
}
const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={classnames(
        className,
        "bg-gray-200 text-gray-darkest font-bold hover:bg-gray-400 rounded py-1 px-2 items-center"
      )}
    >
      {children}
    </button>
  );
};
export default Button;
