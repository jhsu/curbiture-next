import classnames from "classnames";
import React from "react";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  primary?: boolean;
  icon?: boolean;
}

const styles = {
  primary: `bg-blue-500 hover:bg-blue-700 text-white`,
  default: `bg-gray-200 text-gray-darkest hover:bg-gray-400`,
};
const Button = ({
  children,
  disabled = false,
  icon = false,
  primary,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={disabled}
      className={classnames(
        primary ? styles.primary : styles.default,
        "font-bold rounded items-center",
        className,
        icon ? "p-2 rounded-full" : "py-1 px-2"
      )}
    >
      {children}
    </button>
  );
};
export default Button;
