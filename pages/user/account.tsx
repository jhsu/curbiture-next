import { useFirebaseUser } from "hooks/firebase";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Account = () => {
  const { user, isReady } = useFirebaseUser();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !user) {
      router.push("/login");
    }
  }, [user, isReady]);
  if (!user || !isReady) {
    return <div></div>;
  }
  return (
    <div className="">
      <Link href="/map">View Map</Link>
      {user.displayName}
    </div>
  );
};

export default Account;
