import { useEffect } from "react";
import { useAtom } from "jotai";
import { isAdminAtom, userAtom } from "../store";
import { useFirestore } from "../components/firebase";

export const useIsAdmin = () => {
  const db = useFirestore();
  const [user] = useAtom(userAtom);
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
