import { useCallback } from "react";
import { useRouter } from "next/router";
import { useFirebaseUser } from "hooks/firebase";
import Button from "components/Button/Button";

const SignOut = () => {
  const router = useRouter();
  const { signOut } = useFirebaseUser();
  const onSignOut = useCallback(async () => {
    await signOut();
    router.push("/");
  }, [signOut, router]);
  return <Button onClick={onSignOut}>Sign Out</Button>;
};

export default SignOut;
