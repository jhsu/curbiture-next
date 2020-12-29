import { Mapper } from "components/Mapper/Mapper";

const MapPage = () => {
  return (
    <div className="map-container h-full" draggable={false}>
      <Mapper />
    </div>
  );
};

export default MapPage;
