import classnames from "classnames";
import { useAtom } from "jotai";
import { useCallback } from "react";

import Link from "next/link";

import { AddPosting } from "components/admin/AddPost";
import Button from "components/Button/Button";
import { FacebookLogin } from "components/FacebookLogin";
import { Mapper } from "components/Mapper/Mapper";
import { Posts } from "components/Posts";
import {
  ArrowLeft,
  // UserIcon,
} from "../components/SvgIcon";
import { activeView, currentUserAtom, showAddPostAtom } from "../store";
import { NotLoggedIn } from "components/auth/NotLoggedIn";
import { useFirebaseAuth } from "hooks/firebase";
import { CurrentUserDisplay } from "components/auth/CurrentUserDisplay";

export default function IndexPage() {
  const [view] = useAtom(activeView);
  const auth = useFirebaseAuth();
  const [, setUser] = useAtom(currentUserAtom);
  const [showAddPost, setShowAddPost] = useAtom(showAddPostAtom);

  const onSignout = useCallback(async () => {
    await auth.signOut();
    setUser(null);
  }, [auth, setUser]);

  return (
    <div className="flex flex-col flex-1 bg-gray-900">
      <div className="p-1 flex flex-row text-gray-100 justify-end top-nav">
        <NotLoggedIn>
          <FacebookLogin />
          <Link href="/signup">
            <a>Sign up</a>
          </Link>
          <span>or</span>
          <Link href="/login">
            <a>Login</a>
          </Link>
        </NotLoggedIn>
        <CurrentUserDisplay onSignout={onSignout} />
      </div>
      <div className="overflow-hidden flex-1 flex flex-row relative rounded-t-lg">
        {showAddPost && (
          <div className="absolute h-full w-full bg-white z-10 flex flex-col">
            <div>
              <div className="flex flex-row justify-end p-2">
                <Button onClick={() => void setShowAddPost(false)}>
                  <ArrowLeft size="m" />
                </Button>
              </div>
            </div>
            <div className="flex-1 map-container overlow-auto">
              <AddPosting />
            </div>
          </div>
        )}
        <div
          className={classnames(
            "bg-gray-100",
            "w-full md:w-1/3 md:max-w-xs h-full flex flex-col",
            "pt-2",
            { hidden: view !== "list" }
          )}
        >
          {view === "list" && <Posts />}
        </div>
        <div className="flex flex-col flex-1 relative">
          <div className="flex-1 map-container">
            <Mapper active={view === "map" && !showAddPost} />
          </div>
        </div>
      </div>
    </div>
  );
}
