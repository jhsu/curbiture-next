import { motion } from "framer-motion";
import Image from "next/image";

const variants = {
  hidden: {
    y: -200,
    opacity: 0,
  },
  visible: {
    y: [-200, 0, -25, 0, -5, 0],
    opacity: 1,
    transition: {
      delay: 0.3,
      delayChildren: 0.5,
    },
  },
};
const innerVariant = {
  hidden: {
    rotateZ: 0,
  },
  visible: {
    rotateZ: [5, -4, 3, -2, 1, 0],
  },
};
const shadowVariant = {
  hidden: {
    opacity: 0.2,
  },
  visible: {
    transition: {
      delay: 0.5,
    },
    opacity: [0, 0, 0.5, 0.2, 0.8, 0.4, 1],
  },
};

interface SuccessProps {
  onComplete?(): void;
  children?: React.ReactNode;
}
const Success = ({ children, onComplete }: SuccessProps) => {
  return (
    <div
      className="absolute z-20 top-6 bottom-6 left-6 right-6 bg-white bg-opacity-50 rounded p-8 border-gray-400 border-2"
      style={{
        backdropFilter: "blur(10px) saturate(40%)",
        // "-webkit-backdrop-filter": "blur(10px) saturate(10%)",
      }}
    >
      <h2>Success!</h2>
      <div className="mb-4">
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          style={{ width: 160, height: 160, margin: "0 auto" }}
          transition={{ type: "spring", mass: 5, velocity: 2, damping: 15 }}
          onAnimationComplete={onComplete}
        >
          <motion.div
            variants={innerVariant}
            transition={{ type: "spring", mass: 10, damping: 20 }}
            className="z-10"
          >
            <Image src="/images/couch.svg" width={300} height={300} />
          </motion.div>
        </motion.div>
        <motion.div
          variants={shadowVariant}
          initial="hidden"
          animate="visible"
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: -30,
            width: 160,
            height: 30,
            overflow: "hidden",
            background:
              "radial-gradient(ellipse closest-side, #ccc 5%, rgba(0,0,0,0) 80%)",
          }}
        ></motion.div>
      </div>
      <div>{children}</div>
    </div>
  );
};
export default Success;
