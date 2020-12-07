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

const CLOSE = (
  <>
    <line
      x1="200"
      y1="56"
      x2="56"
      y2="200"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    ></line>
    <line
      x1="200"
      y1="200"
      x2="56"
      y2="56"
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

const HOUSE = (
  <>
    <path
      d="M151.99414,207.99263v-48.001a8,8,0,0,0-8-8h-32a8,8,0,0,0-8,8v48.001a8,8,0,0,1-7.999,8l-47.99414.00632a8,8,0,0,1-8.001-8v-92.4604a8,8,0,0,1,2.61811-5.91906l79.9945-72.73477a8,8,0,0,1,10.76339-.00036l80.0055,72.73509A8,8,0,0,1,216,115.53887V207.999a8,8,0,0,1-8.001,8l-48.00586-.00632A8,8,0,0,1,151.99414,207.99263Z"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    ></path>
  </>
);

const TRASH = (
  <>
    <line
      x1="215.99609"
      y1="56"
      x2="39.99609"
      y2="56.00005"
      fill="none"
      stroke="#000000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    ></line>
    <line
      x1="104"
      y1="104"
      x2="104"
      y2="168"
      fill="none"
      stroke="#000000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    ></line>
    <line
      x1="152"
      y1="104"
      x2="152"
      y2="168"
      fill="none"
      stroke="#000000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    ></line>
    <path
      d="M199.99609,56.00005V208a8,8,0,0,1-8,8h-128a8,8,0,0,1-8-8v-152"
      fill="none"
      stroke="#000000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    ></path>
    <path
      d="M168,56V40a16,16,0,0,0-16-16H104A16,16,0,0,0,88,40V56"
      fill="none"
      stroke="#000000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    ></path>
  </>
);

const ARROW_FAT_LEFT = (
  <>
    <path
      d="M120,32,24,128l96,96V176h88a8,8,0,0,0,8-8V88a8,8,0,0,0-8-8H120Z"
      fill="none"
      stroke="#000000"
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

export const CloseIcon = (props: SvgProps) => {
  return <SvgIcon {...props}>{CLOSE}</SvgIcon>;
};

export const HomeIcon = (props: SvgProps) => {
  return <SvgIcon {...props}>{HOUSE}</SvgIcon>;
};

export const TrashIcon = (props: SvgProps) => {
  return <SvgIcon {...props}>{TRASH}</SvgIcon>;
};

export const ArrowLeft = (props: SvgProps) => {
  return <SvgIcon {...props}>{ARROW_FAT_LEFT}</SvgIcon>;
};
