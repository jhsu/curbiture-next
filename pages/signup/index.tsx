import * as React from "react";
import { useRouter } from "next/router";

import { SignUp } from "components/auth/SignUp";
import Link from "next/link";

const SignUpPage = () => {
  const router = useRouter();
  const goHome = React.useCallback(() => {
    router.push("/");
  }, [router]);
  return (
    <div className="flex-1">
      <header>
        <h1>Sign up</h1>
      </header>
      <SignUp onSignup={goHome} />
      <div className="m-2">
        <Link href="/login">
          <a>Already have an account? Login</a>
        </Link>
      </div>
    </div>
  );
};

export default SignUpPage;
