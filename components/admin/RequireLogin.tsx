import { useAtom } from "jotai";
import * as React from "react";
import { currentUserAtom } from "../../store";

export const RequireLogin = ({ children }: { children: React.ReactNode }) => {
  const [user] = useAtom(currentUserAtom);
  if (!user) {
    return null;
  }
  return <>{children}</>;
};
