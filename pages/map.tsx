import Map from "components/Map/Map";
import { Bounds } from "google-map-react";
import { useVisibleLocations } from "hooks/firebase";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { boundsAtom, locAtom } from "store";

const MapPage = () => {
  useVisibleLocations();
  const [items] = useAtom(locAtom);
  const [, setBounds] = useAtom(boundsAtom);
  return (
    <div className="map-container h-full" draggable={false}>
      <Map
        markers={items}
        onBoundsChange={(bounds: Bounds) => {
          if (window.google) {
            setBounds(
              new window.google.maps.LatLngBounds(bounds.sw, bounds.ne)
            );
          }
        }}
      />
    </div>
  );
};

export default MapPage;
