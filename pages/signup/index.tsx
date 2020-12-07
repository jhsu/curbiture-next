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
    <div>
      <SignUp onSignup={goHome} />
      <Link href="/login">
        <a>Already have an account? Login</a>
      </Link>
    </div>
  );
};

export default SignUpPage;
