import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  GoogleAPI,
  GoogleApiWrapper,
  // InfoWindow,
  Map,
} from "google-maps-react";
import MarkerClusterer from "@googlemaps/markerclustererplus";
import { useAtom } from "jotai";

import { GOOGLE_KEY } from "../../google";
import { useVisibleLocations } from "../../hooks/firebase";
import {
  boundsAtom,
  clearPostSelection,
  currentPositionAtom,
  ItemLocation,
  locAtom,
  selectedPostAtom,
  updateSelectedPostAtom,
} from "../../store";
import { Cluster } from "@googlemaps/markerclustererplus/dist/cluster";
import { InfoWindow } from "./InfoWindow";

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
  const [{ location }] = useAtom(currentPositionAtom);

  const map = useRef<Map>(null);

  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow>();

  const onSelectMarker = useCallback(
    (location: ItemLocation) => void onSelectPost(location),
    [onSelectPost]
  );

  const renderedMarkers = useRef<{ [key: string]: google.maps.Marker }>({});

  const currentMarker = selectedPost
    ? renderedMarkers.current[selectedPost.id]
    : null;

  const cluster = useRef<MarkerClusterer>();

  useEffect(() => {
    setInfoWindow(
      new google.maps.InfoWindow({
        content: "",
      })
    );
  }, [google]);

  useEffect(() => {
    if (!infoWindow) {
      return;
    }
    let clusterClick: google.maps.MapsEventListener;

    if (!cluster.current) {
      cluster.current = new MarkerClusterer(map.current.map, [], {
        imagePath: "/map/m",
        maxZoom: 15,
        zoomOnClick: false,
      });
      // TODO: why doesn't this work inside the above?
      clusterClick = google.maps.event.addListener(
        cluster.current,
        "clusterclick",
        (c: Cluster) => {
          console.log("-== SELECTED CLUSTER ====");
          const markers = c.getMarkers();
          // TODO: set multiple visible items
          // TODO: mark an item as selected
          // onSelectMarker(items[0]);
          infoWindow.setPosition(c.getCenter());
          infoWindow.open(map.current.map);
        }
      );
      console.warn(cluster.current);
    } else {
      clusterClick = google.maps.event.addListener(
        cluster.current,
        "clusterclick",
        (c: Cluster) => {
          console.warn("wtf");
        }
      );
    }

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
      // remove marker from clusters
      cluster.current.removeMarker(renderedMarkers.current[id]);
      if (selectedPost?.id === id) {
        onSelectPost(null);
      }
      delete renderedMarkers.current[id];
    });

    items.map((item) => {
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
      const m2 = new google.maps.Marker({
        ...basePrefs,
        position,
        title: `${item.name} 2`,
      });
      const m3 = new google.maps.Marker({
        ...basePrefs,
        position,
        title: `${item.name} 3`,
      });
      google.maps.event.addListener(
        marker,
        "click",
        (m: google.maps.Marker) => {
          // onSelectMarker(item);
          infoWindow.open(map.current.map, m);
        }
      );
      google.maps.event.addListener(m2, "click", (m: google.maps.Marker) => {
        // onSelectMarker(item);
        infoWindow.open(map.current.map, m);
      });
      google.maps.event.addListener(m3, "click", (m: google.maps.Marker) => {
        // onSelectMarker(item);
        infoWindow.open(map.current.map, m);
      });
      cluster.current.addMarker(marker);
      cluster.current.addMarker(m2);
      cluster.current.addMarker(m3);
      renderedMarkers.current[item.id] = marker;
    });

    return () => {
      if (clusterClick) {
        google.maps.event.removeListener(clusterClick);
      }
    };
  }, [infoWindow, items]);

  useEffect(() => {
    if (map.current && location) {
      map.current.map.setCenter(location);
      map.current.map.setZoom(12);
    }
  }, [location]);

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
      {infoWindow && (
        <InfoWindow
          // onClose={onClearSelection}
          infoWindow={infoWindow}
          // visible={!!currentMarker}
          // marker={currentMarker}
          // ref={infoWindow}
        >
          <div>
            <div>
              <h2>{selectedPost?.name}</h2>
              <div>
                {selectedPost?.photo ? (
                  <img width={120} src={selectedPost?.photo} alt="item" />
                ) : (
                  <div>photo</div>
                )}
              </div>
            </div>
          </div>
        </InfoWindow>
      )}
    </Map>
  );
};

export const Mapper = GoogleApiWrapper({
  apiKey: GOOGLE_KEY,
  libraries: ["geometry"],
})(MapContainer);
