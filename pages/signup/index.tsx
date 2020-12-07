import * as React from "react";
import { useRouter } from "next/router";

import { SignUp } from "components/auth/SignUp";
import Button from "components/Button/Button";

const SignUpPage = () => {
  const router = useRouter();
  const goHome = React.useCallback(() => {
    router.push("/");
  }, [router]);
  return (
    <div>
      <SignUp onSignup={goHome} />
      <Button onClick={goHome}>cancel</Button>
    </div>
  );
};

export default SignUpPage;
