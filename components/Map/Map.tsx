import { GOOGLE_KEY } from "google";
import GoogleMap, { Bounds } from "google-map-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import InfoWindow from "./InfoWindow";
import MarkerClusterer from "@googlemaps/markerclustererplus";
import { Cluster } from "@googlemaps/markerclustererplus/dist/cluster";
import { ItemLocation } from "store";
import Link from "next/link";

interface MapProps {
  markers: ItemLocation[];
  onBoundsChange(bounds: Bounds): void;
}
const Map = ({ markers, onBoundsChange }: MapProps) => {
  const [googleMap, setGoogleMap] = useState<google.maps.Map>();
  const dummyMarkers = useMemo<ItemLocation[]>(
    () => [
      {
        id: "1",
        name: "first",
        location: {
          lat: 40.75421,
          lng: -73.983534,
        },
        created_at: new Date(),
        photo: "/images/curb.svg",
      },
      {
        id: "2",
        name: "second",
        location: {
          lat: 40.765879,
          lng: -73.988748,
        },
        created_at: new Date(),
        photo: "/images/curb.svg",
      },
    ],
    []
  );
  const cluster = useRef<MarkerClusterer>();
  const [selected, setSelected] = useState<ItemLocation[]>();

  useEffect(() => {
    if (!googleMap) {
      return;
    }

    const clusterMarkers = (markers.length ? markers : dummyMarkers).map(
      (m) => {
        const loc = m.location;
        const position = new google.maps.LatLng(loc.lat, loc.lng);
        const marker = new google.maps.Marker({
          map: googleMap,
          position,
          title: "title",
        });
        marker.set("data", m);

        google.maps.event.addListener(marker, "click", (e) => {
          const pos = marker.getPosition();
          if (pos) {
            googleMap.panTo(pos);
          }
          setSelected((prevSelected) =>
            prevSelected?.length === 1 && prevSelected[0] === m ? [] : [m]
          );
        });
        return marker;
      }
    );

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

  const centerOn = useCallback(
    (loc: google.maps.LatLngLiteral) => {
      if (googleMap) {
        googleMap.setZoom(16);
        googleMap.panTo(loc);
      }
    },
    [googleMap]
  );

  const infoLocation = selected ? selected[0]?.location : null;

  const onMapChange = useCallback(
    ({ bounds }: { bounds: GoogleMap.Bounds }) => {
      onBoundsChange(bounds);
    },
    [onBoundsChange]
  );

  return (
    <div className="map-container h-full" draggable={false}>
      <GoogleMap
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          minZoom: 10,
          gestureHandling: "greedy",
          zoomControlOptions: {
            position: 6,
          },
          clickableIcons: false,
        }}
        bootstrapURLKeys={{
          key: GOOGLE_KEY,
          libraries: ["geometry"],
        }}
        defaultCenter={{
          lat: 40.75421,
          lng: -73.983534,
        }}
        onChange={onMapChange}
        defaultZoom={8}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => void setGoogleMap(map)}
      >
        {infoLocation && (
          <InfoWindow {...infoLocation} onClose={() => void setSelected([])}>
            {selected?.map((item, idx) => {
              return (
                <div key={idx}>
                  <h2>{item.name}</h2>
                  <Link href={`/posts/${item.id}`}>
                    <img
                      src={item.photo}
                      style={{ maxWidth: "100%" }}
                      title={item.name}
                    />
                  </Link>
                </div>
              );
            })}
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
