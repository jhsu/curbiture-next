import * as React from "react";
import { useEffect, useRef, useState } from "react";
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
  // activeView,
  boundsAtom,
  clearPostSelection,
  currentPositionAtom,
  ItemLocation,
  locAtom,
  updateSelectedPostAtom,
} from "../../store";
import { Cluster } from "@googlemaps/markerclustererplus/dist/cluster";
import { InfoWindow } from "./InfoWindow";
import { ItemInfo } from "./ItemInfo";
import { useRouter } from "next/router";

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
  const [selectedPost, onSelectPost] = useAtom(updateSelectedPostAtom);
  const [{ location }] = useAtom(currentPositionAtom);

  // const [, setView] = useAtom(activeView);

  const map = useRef<Map>(null);

  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow>();
  const [clusterItems, selectClusterItems] = useState<ItemLocation[] | null>(
    null
  );

  const router = useRouter();

  // used to remove out of bounds markers
  const renderedMarkers = useRef<{ [key: string]: google.maps.Marker }>({});

  const cluster = useRef<MarkerClusterer>();

  useEffect(() => {
    setInfoWindow(
      new google.maps.InfoWindow({
        content: "",
      })
    );
  }, [google]);

  const itemsLookup = useRef({});
  useEffect(() => {
    if (items) {
      itemsLookup.current = items.reduce((lookup, item) => {
        lookup[item.id] = item;
        return lookup;
      }, {});
    }
  }, [items]);

  useEffect(() => {
    if (map.current && infoWindow && !cluster.current) {
      cluster.current = new MarkerClusterer(map.current.map, [], {
        imagePath: "/map/m",
        zoomOnClick: false,
        averageCenter: true,
      });
      const clusterClick = google.maps.event.addListener(
        cluster.current,
        "clusterclick",
        (c: Cluster) => {
          onClearSelection();

          const markers = c.getMarkers();
          const posts = markers.map(
            (m) => itemsLookup.current[m.get("postId")]
          );
          selectClusterItems(posts);
          infoWindow.setPosition(c.getCenter());
          if (map.current) {
            infoWindow.open(map.current.map);
          }
        }
      );
      return () => {
        if (clusterClick) {
          google.maps.event.removeListener(clusterClick);
        }
      };
    }
  }, [infoWindow]);

  // close the infoWindow if there isn't a selected post or cluster
  useEffect(() => {
    if (infoWindow && !selectedPost && !clusterItems) {
      infoWindow.close();
    }
  }, [infoWindow, selectedPost, clusterItems]);

  // focus on the selected Post if it exists
  useEffect(() => {
    if (selectedPost && infoWindow && map.current) {
      selectClusterItems(null);
      const target = renderedMarkers.current[selectedPost.id];
      infoWindow.open(map.current.map, target);
      infoWindow.setPosition(selectedPost.location);
    }
  }, [selectedPost, infoWindow]);

  useEffect(() => {
    if (!infoWindow) {
      return;
    }

    // remove out of scope markers
    const itemIds = items.map((i) => i.id);
    const outOfBounds = Object.keys(renderedMarkers.current).filter(
      (id) => !itemIds.includes(id)
    );
    outOfBounds.forEach((id) => {
      renderedMarkers.current[id].setMap(null);
      // remove marker from clusters
      cluster.current?.removeMarker(renderedMarkers.current[id]);
      if (selectedPost?.id === id) {
        onSelectPost(null);
      }
      delete renderedMarkers.current[id];
    });

    // create markers for each item
    items.map((item) => {
      // don't add a marker if the marker already exists
      if (renderedMarkers.current[item.id] || !map.current) {
        return;
      }
      const position = new google.maps.LatLng(
        item.location?.lat,
        item.location?.lng
      );
      const marker = new google.maps.Marker({
        map: map.current.map,
        position,
        title: item.name,
      });
      marker.set("postId", item.id);

      google.maps.event.addListener(marker, "click", () => {
        const post = itemsLookup.current[marker.get("postId")];
        onSelectPost(post);
        if (map.current) {
          infoWindow.open(map.current.map, marker);
        }
      });
      if (cluster.current) {
        cluster.current.addMarker(marker);
      }
      renderedMarkers.current[item.id] = marker;
    });
  }, [infoWindow, items]);

  // zoom to current location or home
  useEffect(() => {
    if (map.current && location) {
      map.current.map.setCenter(location);
      map.current.map.setZoom(12);
    }
  }, [location]);

  // const onViewDetails = useCallback(
  //   (post: ItemLocation) => {
  //     onSelectPost(post);
  //     setView("list");
  //   },
  //   [onSelectPost]
  // );

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
          google={google}
          onClose={onClearSelection}
          infoWindow={infoWindow}
          // visible={!!currentMarker}
          // marker={currentMarker}
          // ref={infoWindow}
        >
          {selectedPost && (
            <ItemInfo
              post={selectedPost}
              onViewDetails={(item) => void router.push(`/posts/${item.id}`)}
            />
          )}
          {clusterItems?.map((item, idx) => (
            <ItemInfo
              key={idx}
              post={item}
              onViewDetails={(item) => void router.push(`/posts/${item.id}`)}
            />
          ))}
        </InfoWindow>
      )}
    </Map>
  );
};

export const Mapper = GoogleApiWrapper({
  apiKey: GOOGLE_KEY,
  libraries: ["geometry"],
})(MapContainer);
