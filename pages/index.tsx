import { useCallback } from "react";
import { useAtom } from "jotai";
import { animated, useSpring } from "react-spring";
import classnames from "classnames";

import { Locations } from "../components/Locations";
import { useFirestore } from "../components/firebase";
import { useFirebaseLocations } from "../hooks/firebase";

import { FacebookLogin } from "../components/FacebookLogin";
import { Mapper } from "../components/Mapper/Mapper";
import { clearPostSelection, selectedLocationAtom } from "../store";
import Button from "../components/Button/Button";

const NavBar = () => {
  // const [, setSelectedPost] = useAtom(selectedLocationAtom);
  const [, clearSelection] = useAtom(clearPostSelection);
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-gray-100 z-40 p-2 flex flex-row">
      <Button onClick={clearSelection}>Posts</Button>
      <Button>+</Button>
      <Button>Map</Button>
    </div>
  );
};

export default function IndexPage() {
  const db = useFirestore();
  const [selectedId, setSelectedPost] = useAtom(selectedLocationAtom);
  useFirebaseLocations({ db });

  // TODO: only do this for mobile
  const props = useSpring({
    x: selectedId !== null ? -100 : 0,
  });

  const onBack = useCallback(() => void setSelectedPost(null), [
    setSelectedPost,
  ]);
  return (
    <div className="h-screen overflow-auto flex flex-row">
      <animated.div
        style={{ transform: props.x.interpolate((x) => `translateX(${x}vw)`) }}
        className={classnames(
          "absolute z-20 inset-0",
          "bg-gray-100",
          "w-full md:w-1/3 md:max-w-xs h-full overflow-auto flex flex-col"
        )}
      >
        <FacebookLogin />
        <Locations />
      </animated.div>
      <div className="w-1/3 max-w-xs hidden md:block transparent"></div>
      <div className={classnames("flex-1 map-container")}>
        {selectedId && (
          <Button className="absolute z-10" onClick={onBack}>
            Back
          </Button>
        )}
        <Mapper />
      </div>
      <NavBar />
    </div>
  );
}
