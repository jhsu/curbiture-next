import classnames from "classnames";
import { useAtom } from "jotai";
import { useCallback } from "react";

import Link from "next/link";

import { AddPosting } from "components/admin/AddPost";
import { RequireLogin } from "components/admin/RequireLogin";
import Button from "components/Button/Button";
import { FacebookLogin } from "components/FacebookLogin";
import { Mapper } from "components/Mapper/Mapper";
import { Posts } from "components/Posts";
import {
  ArrowLeft,
  CrosshairIcon,
  HomeIcon,
  ListIcon,
  MapIcon,
  PlusIcon,
  // UserIcon,
} from "../components/SvgIcon";
import {
  activeView,
  clearPostSelection,
  currentPositionAtom,
  showAddPostAtom,
  userAtom,
} from "../store";
import { NotLoggedIn } from "components/auth/NotLoggedIn";
import { useFirebaseAuth } from "hooks/firebase";

const NavBar = () => {
  const [view, setView] = useAtom(activeView);
  const [showAddPost, setShowAddPost] = useAtom(showAddPostAtom);
  // const [, clearSelection] = useAtom(clearPostSelection);
  const [, setUserLocation] = useAtom(currentPositionAtom);
  const [, clearSelection] = useAtom(clearPostSelection);

  const onAddPost = useCallback(() => void setShowAddPost(true), [
    setShowAddPost,
  ]);
  const onViewMap = useCallback(() => void setView("map"), [setView]);
  const onViewList = useCallback(() => {
    setView("list");
    clearSelection();
  }, [setView]);

  const onCenterUser = useCallback(() => {
    if (navigator.geolocation) {
      // TODO: set loading current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        },
        () => {
          // TODO: notify unable to get location
          // handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    }
  }, []);
  const onCenterHome = useCallback(() => {
    setUserLocation({
      location: {
        lat: 40.75421,
        lng: -73.983534,
      },
    });
  }, []);

  return (
    <nav className="bottom-nav">
      <div className={classnames({ hidden: showAddPost })}>
        <div className="nav-actions absolute right-4 bottom-20 flex-col">
          {view === "map" && (
            <>
              <Button icon onClick={onCenterUser} className="shadow-md">
                <CrosshairIcon size="m" />
              </Button>
              <Button icon onClick={onCenterHome} className="shadow-md">
                <HomeIcon size="m" />
              </Button>
            </>
          )}
          <RequireLogin>
            <Button
              icon
              onClick={onAddPost}
              className={classnames("shadow-md")}
            >
              <PlusIcon size="m" />
            </Button>
          </RequireLogin>
        </div>
      </div>
      {/* <button
        className={classnames("nav-action", {
          "nav-action__active": false,
        })}
      >
        <UserIcon size="s" className="nav-action-button" />
        <span>User</span>
      </button> */}
      <button
        className={classnames("nav-action", {
          "nav-action__active": view === "list",
        })}
        onClick={onViewList}
      >
        <ListIcon size="s" className="nav-action-button" />
        <span>Posts</span>
      </button>
      <button
        className={classnames("nav-action", {
          "nav-action__active": view === "map",
        })}
        onClick={onViewMap}
      >
        <MapIcon size="s" className="nav-action-button" />
        <span>Map</span>
      </button>
    </nav>
  );
};

export default function IndexPage() {
  const [view] = useAtom(activeView);
  const auth = useFirebaseAuth();
  const [currentUser, setUser] = useAtom(userAtom);
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
          <RequireLogin>
            <span className="mr-2">{currentUser.displayName}</span>
            <Button onClick={onSignout}>Logout</Button>
          </RequireLogin>
        </div>
        <div className="flex-1 h-full overflow-auto flex flex-row">
          {showAddPost && (
            <div className="absolute h-full w-full bg-white z-10">
              <div className="flex flex-row self-start">
                <Button onClick={() => void setShowAddPost(false)}>
                  <ArrowLeft size="m" />
                </Button>
              </div>
              <AddPosting />
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
          <NavBar />
        </div>
      </div>
    </>
  );
}
