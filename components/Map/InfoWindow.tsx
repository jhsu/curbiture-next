import * as AccessibleIcon from "@radix-ui/react-accessible-icon";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useEffect, useRef } from "react";

interface InfoWindowProps {
  lat: number;
  lng: number;
  children: React.ReactNode;
  onClose?(): void;
}
const InfoWindow = ({ children, onClose }: InfoWindowProps) => {
  const infoBody = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onScroll(e: Event) {
      e.stopPropagation();
    }
    infoBody.current?.addEventListener("wheel", onScroll);
    return () => {
      infoBody.current?.removeEventListener("wheel", onScroll);
    };
  });
  return (
    <div
      className="bg-white w-40 rounded p-2 overflow-auto"
      style={{ transform: "translate(-50%, calc(-100% - 59px))" }}
    >
      <header className="flex flex-row-reverse">
        <button onClick={onClose} tabIndex={0}>
          <AccessibleIcon.Root label="Close">
            <Cross1Icon />
          </AccessibleIcon.Root>
        </button>
      </header>
      <div className="overflow-auto" ref={infoBody}>
        {children}
      </div>
    </div>
  );
};
export default InfoWindow;
