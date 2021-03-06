import { GOOGLE_KEY } from "google";
import GoogleMap, { Bounds } from "google-map-react";
import { useCallback, useEffect, useRef, useState } from "react";

import InfoWindow from "./InfoWindow";
import MarkerClusterer from "@googlemaps/markerclustererplus";
import { Cluster } from "@googlemaps/markerclustererplus/dist/cluster";
import { ItemLocation } from "store";
import PostInfo from "./PostInfo";

// const dummyMarkers: ItemLocation[] = [
//   {
//     id: "1",
//     name: "first",
//     location: {
//       lat: 40.75421,
//       lng: -73.983534,
//     },
//     created_at: new Date(),
//   },
//   {
//     id: "2",
//     name: "second",
//     location: {
//       lat: 40.765879,
//       lng: -73.988748,
//     },
//     created_at: new Date(),
//   },
// ];

interface MapProps {
  controls?: boolean;
  center?: google.maps.LatLngLiteral;
  initialZoom?: number;
  markers: ItemLocation[];
  onBoundsChange(bounds: Bounds, zoom: number): void;
}
const Map = ({
  controls = true,
  center,
  initialZoom,
  markers,
  onBoundsChange,
}: MapProps) => {
  const [googleMap, setGoogleMap] = useState<google.maps.Map>();
  const cluster = useRef<MarkerClusterer>();
  const [selected, setSelected] = useState<ItemLocation[]>();

  useEffect(() => {
    if (!googleMap) {
      return;
    }

    const clusterMarkers = (markers.length ? markers : []).map((m) => {
      const loc = m.location;
      const position = new google.maps.LatLng(loc.lat, loc.lng);
      const marker = new google.maps.Marker({
        map: googleMap,
        position,
        title: "title",
      });
      marker.set("data", m);

      google.maps.event.addListener(marker, "click", () => {
        const pos = marker.getPosition();
        if (pos) {
          googleMap.panTo(pos);
        }
        setSelected((prevSelected) =>
          prevSelected?.length === 1 && prevSelected[0] === m ? [] : [m]
        );
      });
      return marker;
    });

    cluster.current = new MarkerClusterer(googleMap, clusterMarkers, {
      imagePath: "/map/m",
      zoomOnClick: false,
      averageCenter: true,
    });

    const clusterClick = google.maps.event.addListener(
      cluster.current,
      "clusterclick",
      (c: Cluster) => {
        const items: ItemLocation[] = c.getMarkers().map((m) => m.get("data"));
        setSelected((prevItems) => (prevItems?.length ? [] : items));
      }
    );
    return () => {
      if (clusterClick) {
        google.maps.event.removeListener(clusterClick);
      }
      // TODO: need a smater way to remove clusters

      // cluster.current?.getMarkers().forEach((marker) => {
      //   const markerItem: ItemLocation = marker.get("data");
      //   if (markerItem && !markers.find((m) => m === markerItem)) {
      //     cluster.current?.removeMarker(marker);
      //   }
      // });
      cluster.current?.clearMarkers();
    };
  }, [markers, googleMap]);

  useEffect(() => {
    if (center && googleMap) {
      googleMap.setCenter(center);
    }
  }, [center, googleMap]);
  const [defaultCenter] = useState(
    center || {
      lat: 40.75421,
      lng: -73.983534,
    }
  );

  const infoLocation = selected ? selected[0]?.location : null;

  const onMapChange = useCallback(
    ({ bounds, zoom }: { bounds: GoogleMap.Bounds; zoom: number }) => {
      onBoundsChange(bounds, zoom);
    },
    [onBoundsChange]
  );

  const onGoogleApiLoaded = useCallback(({ map }: { map: google.maps.Map }) => {
    setGoogleMap(map);
  }, []);

  const controlOptions: GoogleMap.MapOptions = controls
    ? {
        zoomControl: true,
      }
    : {
        // draggable: false,
        // scrollwheel: false,
        // panControl: false,
      };

  return (
    <div className="map-container h-full" draggable={false}>
      <GoogleMap
        options={{
          disableDefaultUI: true,
          minZoom: 10,
          gestureHandling: "greedy",
          zoomControlOptions: {
            position: 6,
          },
          clickableIcons: false,
          ...controlOptions,
        }}
        bootstrapURLKeys={{
          key: GOOGLE_KEY,
          libraries: ["geometry"],
        }}
        defaultCenter={defaultCenter}
        resetBoundsOnResize
        onChange={onMapChange}
        defaultZoom={initialZoom || 8}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={onGoogleApiLoaded}
      >
        {infoLocation && (
          <InfoWindow {...infoLocation} onClose={() => void setSelected([])}>
            <div>
              {selected?.map((item) => {
                return <PostInfo key={item.id} post={item} />;
              })}
            </div>
          </InfoWindow>
        )}
        {/* <Marker lat={40.75421} lng={-73.983534} onClick={centerOn}>
          <InfoWindow />
        </Marker> */}
      </GoogleMap>
    </div>
  );
};

export default Map;
