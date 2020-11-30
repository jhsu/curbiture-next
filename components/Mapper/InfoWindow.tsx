import { GoogleAPI } from "google-maps-react";
import * as React from "react";
import { useEffect } from "react";
import ReactDOM from "react-dom";

interface InfoWindowProps {
  infoWindow: google.maps.InfoWindow;
  onClose: () => void;
  children: React.ReactNode;
  google: GoogleAPI;
}
// TODO: handle event listeners
export const InfoWindow = ({
  google,
  infoWindow,
  children,
  onClose,
}: InfoWindowProps) => {
  useEffect(() => {
    if (infoWindow && onClose) {
      const listener = google.maps.event.addListener(
        infoWindow,
        "closeclick",
        onClose
      );
      return () => {
        google.maps.event.removeListener(listener);
      };
    }
  }, [google, infoWindow, onClose]);
  useEffect(() => {
    const div = document.createElement("div");
    ReactDOM.render(children, div);
    infoWindow.setContent(div);
  }, [infoWindow, children]);
  return null;
};
