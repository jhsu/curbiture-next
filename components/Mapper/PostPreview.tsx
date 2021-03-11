import { GOOGLE_KEY } from "google";
// import { GoogleAPI, GoogleApiWrapper, Map, Marker } from "google-maps-react";

import GoogleMap from "google-map-react";
import * as React from "react";
import { useEffect, useState } from "react";

interface PostPreview {
  marker?: google.maps.LatLng | null;
  height: number;
  onGoogleReady(googlemaps: { map: google.maps.Map }): void;
}
// TODO: pass in address
const PostPreview = ({ height, marker, onGoogleReady }: PostPreview) => {
  const [map, setGoogle] = useState<google.maps.Map>();
  useEffect(() => {
    if (marker && map) {
      const pin = new google.maps.Marker({
        map: map,
        position: marker,
        title: "title",
      });
      map.setZoom(14);
      map.panTo(marker);
      return () => {
        pin.setMap(null);
      };
    }
  }, [map, marker]);
  return (
    <div className="relative" style={{ height }}>
      <GoogleMap
        options={{
          draggable: false,
          // scrollwheel: false,
          // panControl: false,
          disableDefaultUI: true,
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
        defaultZoom={8}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={(info) => {
          setGoogle(info.map);
          onGoogleReady(info);
        }}
      ></GoogleMap>
    </div>
  );
};

export default PostPreview;
// export default GoogleApiWrapper({
//   apiKey: GOOGLE_KEY,
// })(PostPreview);
