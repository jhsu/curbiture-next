import { useAtom } from "jotai";
import * as React from "react";
import { currentUserAtom } from "store";

interface NotLoggedInProps {
  children: React.ReactNode;
}
export const NotLoggedIn = ({ children }: NotLoggedInProps) => {
  const [currentUser] = useAtom(currentUserAtom);
  if (!currentUser) {
    return <>{children}</>;
  }
  return null;
};
