import * as React from "react";
import { useCallback, useEffect, useRef } from "react";
import {
  GoogleAPI,
  GoogleApiWrapper,
  InfoWindow,
  Map,
} from "google-maps-react";
import { useAtom } from "jotai";
import { GOOGLE_KEY } from "../../google";
import { useVisibleLocations } from "../../hooks/firebase";
import {
  boundsAtom,
  clearPostSelection,
  ItemLocation,
  locAtom,
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
  const [, onClearSelection] = useAtom(clearPostSelection);
  const [{ post: selectedPost }] = useAtom(selectedPostAtom);
  const [, onSelectPost] = useAtom(updateSelectedPostAtom);

  const map = useRef<Map>(null);

  const infoWindow = useRef<
    InfoWindow & { openWindow: (map, marker) => void }
  >();

  const onSelectMarker = useCallback(
    (location: ItemLocation) => void onSelectPost(location),
    [onSelectPost]
  );

  const renderedMarkers = useRef<{ [key: string]: google.maps.Marker }>({});

  const currentMarker = selectedPost
    ? renderedMarkers.current[selectedPost.id]
    : null;

  useEffect(() => {
    const basePrefs = {
      map: map.current.map,
    };

    // remove out of scope markers
    const itemIds = items.map((i) => i.id);
    const outOfBounds = Object.keys(renderedMarkers.current).filter(
      (id) => !itemIds.includes(id)
    );
    outOfBounds.forEach((id) => {
      renderedMarkers.current[id].setMap(null);
      if (selectedPost?.id === id) {
        onSelectPost(null);
      }
      delete renderedMarkers.current[id];
    });

    items.forEach((item) => {
      if (renderedMarkers.current[item.id]) {
        return;
      }
      const position = new google.maps.LatLng(
        item.location?.lat,
        item.location?.lng
      );
      const marker = new google.maps.Marker({
        ...basePrefs,
        position,
        title: item.name,
      });
      marker.addListener("click", () => {
        onSelectMarker(item);
      });
      renderedMarkers.current[item.id] = marker;
    });
    // map.current
  }, [items]);

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
        // TODO: we should only update bounds when the map is visible
        if (bounds) {
          setBounds(bounds);
        }
      }}
    >
      <InfoWindow
        onClose={onClearSelection}
        visible={!!currentMarker}
        marker={currentMarker}
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
    </Map>
  );
};

export const Mapper = GoogleApiWrapper({
  apiKey: GOOGLE_KEY,
  libraries: ["geometry"],
})(MapContainer);
