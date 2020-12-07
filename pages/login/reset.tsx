import * as React from "react";
import { useRouter } from "next/router";

import { Login as LoginForm } from "components/auth/Login";
import Button from "components/Button/Button";
import { useFirebaseAuth } from "hooks/firebase";
import { useForm } from "react-hook-form";

const Reset = () => {
  const router = useRouter();
  const auth = useFirebaseAuth();
  const { handleSubmit, register, reset } = useForm();

  const goHome = React.useCallback(() => {
    router.push("/");
  }, [router]);

  const goLogin = React.useCallback(() => {
    router.push("/login");
  }, [router]);

  const goSignUp = React.useCallback(() => {
    router.push("/signup");
  }, [router]);

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
      <form onSubmit={handleSubmit(onStartReset)}>
        <label>
          <span>Email</span>
          <input
            ref={register}
            name="email"
            type="email"
            placeholder="E-mail address"
            required
            className="block w-full"
          />
        </label>
        <Button type="submit">Submit</Button>
      </form>
      <Button onClick={goHome}>cancel</Button>
      <div>
        <Button onClick={goSignUp}>Sign up</Button>
        <Button onClick={goLogin}>Go login</Button>
      </div>
    </div>
  );
};

export default Reset;
