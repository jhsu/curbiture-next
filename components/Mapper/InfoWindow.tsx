import * as React from "react";
import { useEffect } from "react";
import ReactDOMServer from "react-dom/server";

interface InfoWindowProps {
  infoWindow: google.maps.InfoWindow;
  children: React.ReactNode;
}
// TODO: handle event listeners
export const InfoWindow = ({ infoWindow, children }: InfoWindowProps) => {
  useEffect(() => {
    const content = ReactDOMServer.renderToString(children);
    infoWindow.setContent(content);
  }, [infoWindow, children]);
  return null;
};
