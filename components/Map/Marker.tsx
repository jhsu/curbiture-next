interface MarkerProps {
  lat: number;
  lng: number;
  children: React.ReactNode;
  onClick(loc: google.maps.LatLngLiteral): void;
}

const Marker = ({ onClick, lat, lng, children }: MarkerProps) => {
  return (
    <div
      style={{
        position: "relative",
        width: 10,
        height: 10,
        backgroundColor: "red",
      }}
    >
      <div onClick={() => void onClick({ lat, lng })}>Marker</div>
      <div
        style={{
          position: "absolute",
          top: 0,
          transform: "translateY(-100%)",
        }}
      >
        {children}
      </div>
    </div>
  );
};
export default Marker;
