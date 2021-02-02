import Layout from "components/Layout/Layout";
import Map from "components/Map/Map";
import { Bounds } from "google-map-react";
import { useVisibleLocations } from "hooks/firebase";
import { useAtom } from "jotai";
import { boundsAtom, locAtom, mapAtom } from "store";

const MapPage = () => {
  useVisibleLocations();
  const [items] = useAtom(locAtom);
  const [, setBounds] = useAtom(boundsAtom);
  const [{ center, zoom }, setMap] = useAtom(mapAtom);
  return (
    <Layout>
      <div className="map-container h-full" draggable={false}>
        <Map
          markers={items}
          defaultCenter={center}
          initialZoom={zoom}
          onBoundsChange={({ sw, ne }: Bounds, zoom: number) => {
            if (window.google) {
              const bounds: google.maps.LatLngBounds = new window.google.maps.LatLngBounds(
                sw,
                ne
              );
              setMap((prev) => {
                const center = bounds.getCenter();
                return {
                  ...prev,
                  zoom,
                  center: {
                    lat: center.lat(),
                    lng: center.lng(),
                  },
                };
              });
              setBounds(bounds);
            }
          }}
        />
      </div>
    </Layout>
  );
};

export default MapPage;
