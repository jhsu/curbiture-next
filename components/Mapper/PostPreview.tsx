import { GOOGLE_KEY } from "google";
import { GoogleAPI, GoogleApiWrapper, Map, Marker } from "google-maps-react";
import * as React from "react";

interface PostPreview {
  google: GoogleAPI;
  marker?: google.maps.LatLng | null;
  height: number;
}
// TODO: pass in address
const PostPreview = ({ google, height, marker }: PostPreview) => {
  return (
    <div className="relative">
      <Map
        initialCenter={{
          lat: 40.75421,
          lng: -73.983534,
        }}
        center={
          marker
            ? {
                lat: marker.lat(),
                lng: marker.lng(),
              }
            : undefined
        }
        google={google}
        disableDefaultUI
        gestureHandling="none"
        style={{
          width: "100%",
        }}
        containerStyle={{
          //   width: "100%",
          height: height,
        }}
      >
        {marker && <Marker position={marker}></Marker>}
      </Map>
    </div>
  );
};

export default PostPreview;
// export default GoogleApiWrapper({
//   apiKey: GOOGLE_KEY,
// })(PostPreview);
