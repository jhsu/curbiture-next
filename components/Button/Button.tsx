import React from "react";

const Button = ({ children, ...props }) => {
  return (
    <button
      className="bg-gray-200 text-gray-darkest font-bold hover:bg-gray-400 rounded py-1 px-2 items-center"
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;
