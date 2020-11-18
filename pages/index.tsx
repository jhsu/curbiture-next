import { Locations } from "../components/Locations";
import { useFirestore } from "../components/firebase";
import { useFirebaseLocations } from "../hooks/firebase";

import { FacebookLogin } from "../components/FacebookLogin";

export default function IndexPage() {
  const db = useFirestore();
  useFirebaseLocations({ db });

  return (
    <div>
      <FacebookLogin />
      <Locations />
    </div>
  );
}
