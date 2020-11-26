import { useAtom } from "jotai";
import * as React from "react";
import { userAtom } from "../../store";

export const RequireLogin = ({ children }: { children: React.ReactNode }) => {
  const [user] = useAtom(userAtom);
  if (!user) {
    return null;
  }
  return <>{children}</>;
};
