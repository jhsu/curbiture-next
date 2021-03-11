import { useCallback, useState } from "react";
import { useSprings } from "react-spring";
import { animated } from "react-spring";

interface CarouselProps {
  items: any[];
}
const Carousel = ({ items = [] }: CarouselProps) => {
  const [idx, setIdx] = useState(0);
  const total = items.length;
  const next = useCallback(() => {
    setIdx((prev) => (prev === total - 1 ? 0 : prev + 1));
  }, [total]);
  const prev = useCallback(() => {
    setIdx((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const [springProps, setSpringProps] = useSprings(total, (idx) => ({
    offset: idx,
  }));
  return (
    <div style={{ position: "relative" }}>
      {springProps.map(({ offset }) => {
        return (
          <animated.div
            style={{
              transform: offset.to(
                (offsetX) => `translate3d(${offsetX * 100}%), 0, 0)`
              ),
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          >
            testing
          </animated.div>
        );
      })}
    </div>
  );
};

export default Carousel;
