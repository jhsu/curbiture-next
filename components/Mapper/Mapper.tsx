import {
  GoogleAPI,
  GoogleApiWrapper,
  InfoWindow,
  Map,
  Marker,
} from "google-maps-react";
import { useAtom } from "jotai";
import * as React from "react";
import { useCallback, useRef } from "react";
import { GOOGLE_KEY } from "../../google";
import { useVisibleLocations } from "../../hooks/firebase";
import {
  boundsAtom,
  ItemLocation,
  locAtom,
  selectedLocationAtom,
  selectedPostAtom,
  updateSelectedPostAtom,
} from "../../store";

const containerStyle = {
  position: "relative",
  width: "100%",
  height: "100%",
};
const MapContainer = ({ google }: { active?: boolean; google: GoogleAPI }) => {
  useVisibleLocations();
  const [items] = useAtom(locAtom);
  const [, setBounds] = useAtom(boundsAtom);
  const [selectedLocation] = useAtom(selectedLocationAtom);
  const [{ post: selectedPost }] = useAtom(selectedPostAtom);
  const [, onSelectPost] = useAtom(updateSelectedPostAtom);
  // const [, setGoogleMap] = useAtom(mapAtom);

  const markers = useRef<{ [locId: string]: google.maps.Marker }>({});

  const map = useRef<Map>(null);

  // ensure locations are visible
  // useEffect(() => {
  //   if (google && map.current && locations.length > 0 && active) {
  //     const gmap = map.current.map;
  //     const zoomBounds = new google.maps.LatLngBounds();
  //     locations.forEach((loc) => {
  //       zoomBounds.extend(loc.location);
  //     });
  //     // TODO: don't do this if the user has interacted with the map
  //     gmap.fitBounds(zoomBounds, 20);
  //     if (gmap.getZoom() > 15) {
  //       gmap.setZoom(15);
  //     }
  //   }
  // }, [google, locations, active]);

  // useEffect(() => {
  //   if (map.current) {
  //     setGoogleMap({ map: map.current.map });
  //   }
  //   return () => {
  //     setGoogleMap({ map: null });
  //   };
  // }, [setGoogleMap]);

  const infoWindow = useRef();

  const onSelectMarker = useCallback(
    (location: ItemLocation) => void onSelectPost(location),
    [onSelectPost]
  );
  const deselectMarker = useCallback(() => {
    onSelectPost(null);
  }, [onSelectPost]);

  const currentMarker = selectedPost
    ? markers.current[selectedPost.id]
    : undefined;

  // const onBoundsChanged = useCallback();
  // TODO: need a better way to use the info window without requiring the marker
  return (
    <Map
      ref={map}
      disableDefaultUI
      zoomControl
      zoomControlOptions={{
        position: google.maps.ControlPosition.LEFT_BOTTOM,
      }}
      minZoom={10}
      gestureHandling="greedy"
      containerStyle={containerStyle}
      initialCenter={{
        lat: 40.75421,
        lng: -73.983534,
      }}
      style={containerStyle}
      google={google}
      onBoundsChanged={(_props, map) => {
        const bounds = map?.getBounds();
        if (bounds) {
          setBounds(bounds);
        }
      }}
    >
      <InfoWindow
        onClose={deselectMarker}
        visible={!!selectedLocation}
        marker={currentMarker}
        // position={selectedLocation}
        ref={infoWindow}
      >
        <div>
          <div>
            <h2>{selectedPost?.name}</h2>
            {selectedPost?.photo && (
              <img width={120} src={selectedPost?.photo} alt="item" />
            )}
          </div>
        </div>
      </InfoWindow>

      {items.map((item) => (
        <Marker
          key={item.id}
          onClick={() => onSelectMarker(item)}
          ref={(marker) => {
            if (marker) {
              markers.current[item.id] = marker.marker;
              if (
                map.current &&
                infoWindow.current &&
                item.id === selectedPost?.id
              ) {
                infoWindow.current?.openWindow(map.current, marker);
              }
            }
          }}
          title={item.name}
          position={item.location}
        ></Marker>
      ))}
    </Map>
  );
};

export const Mapper = GoogleApiWrapper({
  apiKey: GOOGLE_KEY,
  libraries: ["geometry"],
})(MapContainer);
