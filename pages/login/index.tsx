// import * as React from "react";
import { useEffect, useMemo } from "react";
import Link from "next/link";

import { Login as LoginForm } from "components/auth/Login";
import { FacebookLogin } from "components/FacebookLogin";
import { useRouter } from "next/router";
import { useFirebaseUser } from "hooks/firebase";

function validRedirect(
  destination: string | string[] | undefined,
  current: string
): boolean | string {
  if (!destination) {
    return false;
  }
  const destUrl = (Array.isArray(destination)
    ? destination[0]
    : destination) as string;

  if (destUrl.includes(current)) {
    return false;
  }
  return /^\//.test(destUrl) && destUrl;
}

const Login = () => {
  const router = useRouter();
  const { user, isReady } = useFirebaseUser();
  const redirectTo = useMemo(
    () =>
      (validRedirect(router.query.redirect_to, router.pathname) ||
        "/map") as string,
    []
  );
  // TODO: disable page if not ready
  useEffect(() => {
    if (isReady && user) {
      router.push(redirectTo);
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
