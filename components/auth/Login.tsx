import { useAtom } from "jotai";
import * as React from "react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useFirebaseAuth } from "../../hooks/firebase";
import { userAtom } from "../../store";
import Button from "../Button/Button";

export const Login = () => {
  const auth = useFirebaseAuth();
  const [, setUser] = useAtom(userAtom);
  const { register, handleSubmit } = useForm();

  const onSubmit = useCallback(
    async ({ email, password }) => {
      console.log(email, password);
      try {
        const user = await auth.signInWithEmailAndPassword(email, password);
        setUser(user.user);
      } catch (err) {
        console.error(err.code, err.message);
      }
    },

    [auth]
  );
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="user_email"></label>
        <input
          placeholder="Your e-mail"
          ref={register}
          name="email"
          id="user_email"
          type="email"
          required
        />
      </div>
      <div>
        <label htmlFor="user_password"></label>
        <input
          placeholder="Enter a password with atleast 6 characters"
          ref={register}
          name="password"
          id="user_password"
          type="password"
          required
          min="6"
        />
      </div>

      <Button type="submit">submit</Button>
    </form>
  );
};
