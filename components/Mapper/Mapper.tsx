import {
  GoogleAPI,
  GoogleApiWrapper,
  InfoWindow,
  Map,
  Marker,
} from "google-maps-react";
import { useAtom } from "jotai";
import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GOOGLE_KEY } from "../../google";
import { useVisibleLocations } from "../../hooks/firebase";
import {
  boundsAtom,
  locAtom,
  // mapAtom,
  selectedLocationAtom,
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
  const [selectedLocationId, selectLocation] = useAtom(selectedLocationAtom);
  // const [, setGoogleMap] = useAtom(mapAtom);

  const selectedLocation = useMemo(
    () => items.find((loc) => loc.id === selectedLocationId),
    [items, selectedLocationId]
  );
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
    (location) => void selectLocation(location.id),
    [selectLocation]
  );
  const deselectMarker = useCallback(() => {
    selectLocation(null);
  }, [selectLocation]);

  const currentMarker = selectedLocationId
    ? markers.current[selectedLocationId]
    : undefined;

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
        visible={!!currentMarker}
        marker={currentMarker}
        ref={infoWindow}
      >
        <div>
          <div>
            <h2>{selectedLocation?.name}</h2>
            {selectedLocation?.photo && (
              <img width={120} src={selectedLocation?.photo} alt="item" />
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
              if (infoWindow.current && item.id === selectedLocationId) {
                infoWindow.current;
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
