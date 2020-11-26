import classnames from "classnames";
import * as React from "react";

const CROSSHAIR = (
  <>
    <circle
      cx="128"
      cy="128"
      r="92"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    ></circle>
    <line
      x1="128"
      y1="36"
      x2="128"
      y2="76"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    ></line>
    <line
      x1="36"
      y1="128"
      x2="76"
      y2="128"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    ></line>
    <line
      x1="128"
      y1="220"
      x2="128"
      y2="180"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    ></line>
    <line
      x1="220"
      y1="128"
      x2="180"
      y2="128"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    ></line>
  </>
);

const PLUS = (
  <>
    <line
      x1="40"
      y1="128"
      x2="216"
      y2="128"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    ></line>
    <line
      x1="128"
      y1="40"
      x2="128"
      y2="216"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    ></line>
  </>
);

const MAP = (
  <>
    <polyline
      points="96 184 32 200 32 56 96 40"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    ></polyline>
    <polygon
      points="160 216 96 184 96 40 160 72 160 216"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    ></polygon>
    <polyline
      points="160 72 224 56 224 200 160 216"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    ></polyline>
  </>
);

const LIST = (
  <>
    <line
      x1="96"
      y1="68"
      x2="216"
      y2="68"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    ></line>
    <line
      x1="96.00614"
      y1="128"
      x2="216"
      y2="128"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    ></line>
    <line
      x1="96.00614"
      y1="188"
      x2="216"
      y2="188"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    ></line>
    <line
      x1="40"
      y1="68"
      x2="56"
      y2="68"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    ></line>
    <line
      x1="40.00614"
      y1="128"
      x2="56"
      y2="128"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    ></line>
    <line
      x1="40.00614"
      y1="188"
      x2="56"
      y2="188"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    ></line>
  </>
);

const USER = (
  <>
    <circle
      cx="128"
      cy="96"
      r="64"
      fill="none"
      strokeMiterlimit="10"
      strokeWidth="16"
    ></circle>
    <path
      d="M30.989,215.99064a112.03731,112.03731,0,0,1,194.02311.002"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    ></path>
  </>
);

interface SvgProps extends React.HTMLAttributes<SVGElement> {
  as?: string;
  size?: "s" | "m" | "l";
  className?: string;
  children?: React.ReactNode;
}
const sizeClasses = {
  s: "h-4 w-4",
  m: "h-6 w-6",
  l: "h-8 w-8",
};
export const SvgIcon = ({
  children,
  size = "s",
  className,
  ...svgProps
}: SvgProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="192"
      height="192"
      fill="#000000"
      viewBox="0 0 256 256"
      {...svgProps}
      className={classnames("stroke-current", className, sizeClasses[size])}
    >
      {children}
    </svg>
  );
};

export const CrosshairIcon = (props: SvgProps) => {
  return <SvgIcon {...props}>{CROSSHAIR}</SvgIcon>;
};

export const PlusIcon = (props: SvgProps) => {
  return <SvgIcon {...props}>{PLUS}</SvgIcon>;
};

export const MapIcon = (props: SvgProps) => {
  return <SvgIcon {...props}>{MAP}</SvgIcon>;
};

export const ListIcon = (props: SvgProps) => {
  return <SvgIcon {...props}>{LIST}</SvgIcon>;
};

export const UserIcon = (props: SvgProps) => {
  return <SvgIcon {...props}>{USER}</SvgIcon>;
};
