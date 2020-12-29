import { useAtom } from "jotai";
import * as React from "react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useFirebaseAuth } from "hooks/firebase";
import { currentUserAtom } from "store";
import Button from "components/Button/Button";
import Link from "next/link";

interface SignUpProps {
  onSignup?(): void;
}
export const SignUp = ({ onSignup }: SignUpProps) => {
  const auth = useFirebaseAuth();
  const [, setUser] = useAtom(currentUserAtom);
  const { errors, register, getValues, handleSubmit } = useForm();
  const onSubmit = useCallback(
    async ({ email, password }) => {
      try {
        const user = await auth.createUserWithEmailAndPassword(email, password);
        setUser(user.user);
        if (onSignup) {
          onSignup();
        }
      } catch (err) {
        console.error(err.code, err.message);
      }
    },

    [auth]
  );
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      <div className="mb-4">
        <label className="block" htmlFor="user_email">
          E-mail
        </label>
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
      <div className="mb-4">
        <label className="block" htmlFor="user_password">
          Password
        </label>
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
      <div className="mb-4">
        <label className="block" htmlFor="user_password_confirmation">
          Password Confirmation
        </label>
        <input
          placeholder="Repeat password for confirmation"
          ref={register({
            validate: (value) => {
              return value === getValues().password;
            },
          })}
          name="password_confirmation"
          id="user_password_confirmation"
          type="password"
          required
          min="6"
          className="text-input"
        />
        {errors?.password_confirmation && (
          <div className="text-red-300">Your passwords must match</div>
        )}
      </div>

      <div className="flex flex-row">
        <div className="flex-1">
          <Button type="submit">submit</Button>
        </div>
        <Link href="/">
          <a>cancel</a>
        </Link>
      </div>
    </form>
  );
};
