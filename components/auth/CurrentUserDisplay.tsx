import Button from "components/Button/Button";
import { useAtom } from "jotai";
import * as React from "react";
import { userAtom } from "store";

export const CurrentUserDisplay = ({ onSignout }: { onSignout(): void }) => {
  const [currentUser] = useAtom(userAtom);
  if (currentUser) {
    return (
      <div>
        <span className="mr-2">{currentUser.displayName}</span>
        <Button onClick={onSignout} className="text-gray-700">
          Logout
        </Button>
      </div>
    );
  }
  return null;
};
