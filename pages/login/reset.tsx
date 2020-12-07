import * as React from "react";

import Button from "components/Button/Button";
import { useFirebaseAuth } from "hooks/firebase";
import { useForm } from "react-hook-form";
import Link from "next/link";

const Reset = () => {
  const auth = useFirebaseAuth();
  const { handleSubmit, register, reset } = useForm();

  const [resetSent, setResetSent] = React.useState(false);

  const onStartReset = React.useCallback(
    async ({ email }) => {
      try {
        await auth.sendPasswordResetEmail(email);
        setResetSent(true);
        reset();
      } catch (err) {
        console.error(err);
      }
    },
    [auth]
  );

  return (
    <div>
      <h2>Forgot your password?</h2>
      <p>Enter your email address to reset your password.</p>
      {resetSent && <div>Reset email has been sent.</div>}
      <form onSubmit={handleSubmit(onStartReset)} className="auth-form">
        <label>
          <span>Email</span>
          <input
            ref={register}
            name="email"
            type="email"
            placeholder="E-mail address"
            required
            className="text-input"
          />
        </label>
        <Button type="submit">Submit</Button>
      </form>
      <Link href="/">
        <a>cancel</a>
      </Link>
      <div>
        <Link href="/signup">
          <a>Sign up</a>
        </Link>
        <Link href="/login">
          <a>Login</a>
        </Link>
      </div>
    </div>
  );
};

export default Reset;
