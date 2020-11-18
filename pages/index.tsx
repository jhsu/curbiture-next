import { Locations } from "../components/Locations";
import { useFirestore } from "../components/firebase";
import { useFirebaseLocations } from "../hooks/firebase";

export default function IndexPage() {
  const db = useFirestore();
  useFirebaseLocations({ db });

  return (
    <div>
      <Locations />
    </div>
  );
}
