import { useAtom } from "jotai";
import * as React from "react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useFirebaseAuth } from "hooks/firebase";
import { userAtom } from "store";
import Button from "components/Button/Button";

interface SignUpProps {
  onSignup?(): void;
}
export const SignUp = ({ onSignup }: SignUpProps) => {
  const auth = useFirebaseAuth();
  const [, setUser] = useAtom(userAtom);
  const { errors, register, getValues, handleSubmit } = useForm();
  const onSubmit = useCallback(
    async ({ email, password }) => {
      console.log(email, password);
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
    <form onSubmit={handleSubmit(onSubmit)} className="p-2">
      <label className="block mb-2">
        <span className="block">E-mail</span>
        <input
          placeholder="Your e-mail"
          ref={register}
          name="email"
          id="user_email"
          type="email"
          required
          className="block w-full p-1 mt-1 focus:ring focus:outline-none"
        />
      </label>
      <label className="block mb-2">
        <span className="block">Password</span>
        <input
          placeholder="Enter a password with atleast 6 characters"
          ref={register}
          name="password"
          id="user_password"
          type="password"
          required
          min="6"
          className="block w-full p-1 mt-1 focus:ring focus:outline-none"
        />
      </label>
      <label className="block mb-2">
        <span className="block">Password Confirmation</span>
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
          className="block w-full p-1 mt-1 focus:ring focus:outline-none"
        />
        {errors?.password_confirmation && (
          <div className="text-red-300">Your passwords must match</div>
        )}
      </label>

      <Button type="submit">submit</Button>
    </form>
  );
};
