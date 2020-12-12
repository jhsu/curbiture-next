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
import { activeView, showAddPostAtom, userAtom } from "../store";
import { NotLoggedIn } from "components/auth/NotLoggedIn";
import { useFirebaseAuth } from "hooks/firebase";
import { CurrentUserDisplay } from "components/auth/CurrentUserDisplay";

export default function IndexPage() {
  const [view] = useAtom(activeView);
  const auth = useFirebaseAuth();
  const [, setUser] = useAtom(userAtom);
  const [showAddPost, setShowAddPost] = useAtom(showAddPostAtom);

  const onSignout = useCallback(async () => {
    await auth.signOut();
    setUser(null);
  }, [auth, setUser]);

  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="p-1">
          <NotLoggedIn>
            <FacebookLogin />
            <Link href="/signup">
              <a>Sign up</a>
            </Link>
            <Link href="/login">
              <a>Login</a>
            </Link>
          </NotLoggedIn>
          <CurrentUserDisplay onSignout={onSignout} />
        </div>
        <div className="flex-1 h-full overflow-auto flex flex-row relative">
          {showAddPost && (
            <div className="absolute h-full w-full bg-white z-10 flex flex-col">
              <div className="flex flex-row self-start">
                <Button onClick={() => void setShowAddPost(false)}>
                  <ArrowLeft size="m" />
                </Button>
              </div>
              <div className="flex-1 map-container">
                <AddPosting />
              </div>
            </div>
          )}
          <div
            className={classnames(
              "bg-gray-100",
              "w-full md:w-1/3 md:max-w-xs h-full overflow-auto flex flex-col",
              { hidden: view !== "list" }
            )}
          >
            {view === "list" && <Posts />}
          </div>
          <div className={classnames("flex-1 map-container")}>
            <Mapper active={view === "map" && !showAddPost} />
          </div>
        </div>
      </div>
    </>
  );
}
