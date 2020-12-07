import * as React from "react";
import Link from "next/link";

import { Login as LoginForm } from "components/auth/Login";

const Login = () => {
  return (
    <div>
      <LoginForm />
      <div>
        <Link href="/signup">
          <a>Don't have an account? Sign up</a>
        </Link>
        <Link href="/login/reset">
          <a>Forgot my password</a>
        </Link>
      </div>
    </div>
  );
};

export default Login;
