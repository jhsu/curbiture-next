import * as React from "react";
import { useCallback, useMemo, useRef, useEffect } from "react";
import {
  Marker,
  Map,
  InfoWindow,
  GoogleApiWrapper,
  GoogleAPI
} from "google-maps-react";
import { useAtom } from "jotai";
import {} from "googlemaps";

import { useFirestore } from "../firebase";
import { useFirebaseLocations } from "../../hooks/firebase";
import { locAtom, boundsAtom, selectedLocationAtom } from "../../store";

import { GOOGLE_KEY } from "../../google";

const containerStyle = {
  position: "relative",
  width: "100%",
  height: "100%"
};
const MapContainer = ({ google }: { google: GoogleAPI }) => {
  const db = useFirestore();
  useFirebaseLocations({ db });
  const [locations] = useAtom(locAtom);
  const [, setBounds] = useAtom(boundsAtom);
  const [selectedLocationId, selectLocation] = useAtom(selectedLocationAtom);

  const selectedLocation = useMemo(
    () => locations.find((loc) => loc.id === selectedLocationId),
    [locations, selectedLocationId]
  );
  const markers = useRef<{ [locId: string]: google.maps.Marker }>({});

  const map = useRef<Map & { map: any }>(null);
  useEffect(() => {
    if (map.current && locations.length > 0) {
      const gmap = map.current.map;
      var zoomBounds = new google.maps.LatLngBounds();
      locations.forEach((loc) => {
        zoomBounds.extend(loc.location);
      });
      // TODO: don't do this if the user has interacted with the map
      gmap.fitBounds(zoomBounds, 20);
      if (gmap.getZoom() > 15) {
        gmap.setZoom(15);
      }
    }
  }, [google, locations]);

  const onSelectMarker = useCallback(
    ({ location }) => {
      selectLocation(location.id);
    },
    [selectLocation]
  );
  const deselectMarker = useCallback(() => {
    selectLocation(null);
  }, [selectLocation]);

  const currentMarker = selectedLocationId
    ? markers.current[selectedLocationId]
    : undefined;

  return (
    <Map
      className="h-full w-full"
      ref={map}
      disableDefaultUI
      zoomControl
      minZoom={10}
      gestureHandling="greedy"
      containerStyle={containerStyle}
      initialCenter={{
        lat: 40.75421,
        lng: -73.983534
      }}
      style={containerStyle}
      google={google}
      onBoundsChanged={(_props, map) => {
        const bounds = map?.getBounds();
        if (bounds) {
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();
          setBounds({
            ne: ne.toJSON(),
            sw: sw.toJSON()
          });
        }
      }}
    >
      <InfoWindow
        onClose={deselectMarker}
        visible={!!currentMarker}
        // position={selectedLocation?.location}
        marker={currentMarker}
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

      {locations.map((location, idx) => (
        <Marker
          onClick={onSelectMarker}
          ref={(marker) => {
            if (marker) {
              markers.current[location.id] = marker.marker;
              // marker.getMarker().then((markEl: google.maps.Marker) => {
              //   markers.current[location.id] = marker.marker;
              // });
            }
          }}
          location={location}
          key={idx}
          title={location.name}
          position={location.location}
        ></Marker>
      ))}
    </Map>
  );
};

export const Mapper = GoogleApiWrapper({
  apiKey: GOOGLE_KEY
})(MapContainer);
