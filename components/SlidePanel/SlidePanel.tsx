import React, { useEffect } from "react";
import { useDrag } from "react-use-gesture";
import { useSpring, animated } from "react-spring";

interface SlidePanelProps {
  className?: string;
  children?: React.ReactNode;
  onClose?(): void;
  visible?: boolean;
}
const SlidePanel = ({
  onClose,
  visible = false,
  children,
}: SlidePanelProps) => {
  const [props, set, stop] = useSpring(() => ({
    left: 0,
    right: visible ? 0 : -100,
  }));
  useEffect(() => {
    if (stop) {
      stop();
    }
    set({ left: 0, right: visible ? 0 : -100 });
  }, [stop, visible]);
  const bind = useDrag(
    ({ down, movement: [mx], swipe: [swipeX] }) => {
      if (onClose && swipeX === 1) {
        onClose();
        set({ right: -100, left: 0 });
      } else {
        set({ left: down ? mx : 0 });
      }
    },
    {
      useTouch: true,
      bounds: { left: 0 },
      threshold: 15,
      swipeDuration: 500,
      swipeVelocity: 0.1,
      swipeDistance: 50,
    }
  );
  return (
    <animated.div
      {...bind()}
      className="absolute top-0 w-full h-full bg-white z-50"
      style={{
        right: props.right.to((r) => `${r}%`),
        transform: props.left.to((l) => `translate3d(${l}px,0,0)`),
      }}
    >
      {children}
    </animated.div>
  );
};
export default SlidePanel;
