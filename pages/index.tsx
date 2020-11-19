import { Locations } from "../components/Locations";
import { useFirestore } from "../components/firebase";
import { useFirebaseLocations } from "../hooks/firebase";

import { FacebookLogin } from "../components/FacebookLogin";
import { Mapper } from "../components/Mapper/Mapper";

export default function IndexPage() {
  const db = useFirestore();
  useFirebaseLocations({ db });

  return (
    <div className="h-screen overflow-auto flex flex-row">
      <div className="w-full md:w-1/3 md:max-w-xs h-full overflow-auto">
        <FacebookLogin />
        <Locations />
      </div>
      <div className="hidden md:block flex-1 map-container">
        <Mapper />
      </div>
    </div>
  );
}
