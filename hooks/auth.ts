import { useAtom } from "jotai";
import { useEffect } from "react";
import { useFirestore } from "../components/firebase";
import { currentUserAtom, isAdminAtom } from "../store";

export const useIsAdmin = () => {
  const db = useFirestore();
  const [user] = useAtom(currentUserAtom);
  const [isAdmin, setIsAdmin] = useAtom(isAdminAtom);

  useEffect(() => {
    if (user && db) {
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const { roles } = doc.data() as {
              roles: { [key: string]: boolean };
            };
            setIsAdmin(roles.admin);
          }
        });
    }
  }, [db, user, setIsAdmin]);

  return isAdmin;
};
