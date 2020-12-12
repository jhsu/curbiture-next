import { useAtom } from "jotai";
import * as React from "react";
import { useCallback } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useFirebaseAuth } from "hooks/firebase";
import { userAtom } from "store";
import Button from "components/Button/Button";
import { useRouter } from "next/router";

// TODO: handle reauth
export const Login = () => {
  const auth = useFirebaseAuth();
  const [, setUser] = useAtom(userAtom);
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = useCallback(
    async ({ email, password }) => {
      try {
        const user = await auth.signInWithEmailAndPassword(email, password);
        setUser(user.user);
        router.push("/");
      } catch (err) {
        console.error(err.code, err.message);
      }
    },

    [auth, router]
  );
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      <div>
        <label htmlFor="user_email">E-mail</label>
        <input
          placeholder="Your e-mail"
          ref={register}
          name="email"
          id="user_email"
          type="email"
          required
          className="text-input"
        />
      </div>
      <div>
        <label htmlFor="user_password">Password</label>
        <input
          placeholder="Enter a password with atleast 6 characters"
          ref={register}
          name="password"
          id="user_password"
          type="password"
          required
          min="6"
          className="text-input"
        />
      </div>

      <div>
        <Button type="submit">submit</Button>
        <Link href="/">
          <a>cancel</a>
        </Link>
      </div>
    </form>
  );
};
