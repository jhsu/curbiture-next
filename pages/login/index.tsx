import * as React from "react";
import { useRouter } from "next/router";

import { Login as LoginForm } from "components/auth/Login";
import Button from "components/Button/Button";
import { useFirebaseAuth } from "hooks/firebase";

const Login = () => {
  const router = useRouter();
  const auth = useFirebaseAuth();
  const goHome = React.useCallback(() => {
    router.push("/");
  }, [router]);
  const goSignUp = React.useCallback(() => {
    router.push("/signup");
  }, [router]);

  const onStartReset = React.useCallback(async () => {
    router.push("/login/reset");
  }, [auth]);

  return (
    <div>
      <LoginForm />
      <Button onClick={goHome}>cancel</Button>
      <div>
        <Button onClick={goSignUp}>Sign up</Button>
        <Button onClick={onStartReset}>Forgot my password</Button>
      </div>
    </div>
  );
};

export default Login;
