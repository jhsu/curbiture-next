import { useAtom } from "jotai";
import * as React from "react";
import { userAtom } from "store";

interface NotLoggedInProps {
  children: React.ReactNode;
}
export const NotLoggedIn = ({ children }: NotLoggedInProps) => {
  const [currentUser] = useAtom(userAtom);
  if (!currentUser) {
    return <>{children}</>;
  }
  return null;
};
