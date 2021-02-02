// import * as React from "react";
import { useEffect } from "react";
import Link from "next/link";

import { Login as LoginForm } from "components/auth/Login";
import { FacebookLogin } from "components/FacebookLogin";
import { useRouter } from "next/router";
import { useFirebaseUser } from "hooks/firebase";

const Login = () => {
  const router = useRouter();
  const { user, isReady } = useFirebaseUser();
  useEffect(() => {
    if (isReady && user) {
      router.push("/posts");
    }
  }, [router, user, isReady]);
  return (
    <div className="flex-1">
      <header>
        <h1>Login</h1>
      </header>
      <LoginForm />
      <div className="m-2">
        <div>
          <Link href="/signup">
            <a>Don't have an account? Sign up now</a>
          </Link>
        </div>
        <div>
          <Link href="/login/reset">
            <a>Forgot my password</a>
          </Link>
        </div>
      </div>

      <div className="p-2">
        <FacebookLogin />
      </div>
    </div>
  );
};

export default Login;
