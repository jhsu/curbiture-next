import { useAtom } from "jotai";
import { useCallback } from "react";
import {
  activeView,
  bottomNavAtom,
  clearPostSelection,
  currentPositionAtom,
  showAddPostAtom,
} from "store";
import classnames from "classnames";
import {
  CrosshairIcon,
  HomeIcon,
  ListIcon,
  MapIcon,
  PlusIcon,
} from "components/SvgIcon";
import { RequireLogin } from "components/admin/RequireLogin";
import Button from "components/Button/Button";
import Link from "next/link";
import { useRouter } from "next/router";

export const BottomNav = () => {
  const router = useRouter();
  const [view, setView] = useAtom(activeView);
  const [showAddPost, setShowAddPost] = useAtom(showAddPostAtom);
  const [, setUserLocation] = useAtom(currentPositionAtom);
  // const [, clearSelection] = useAtom(clearPostSelection);
  const [{ showActions }] = useAtom(bottomNavAtom);

  const homeRoute = router.pathname === "/";

  const onAddPost = useCallback(() => void setShowAddPost(true), [
    setShowAddPost,
  ]);
  const onViewMap = useCallback(() => {
    setView("map");
    // clearSelection();
    router.push("/");
  }, [setView]);
  const onViewList = useCallback(() => {
    setView("list");
    // clearSelection();
    router.push("/");
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
      <div className={classnames({ hidden: showAddPost || !showActions })}>
        <div
          className={classnames(
            "nav-actions absolute right-4 bottom-20 flex-col",
            { "nav-actions__hidden": !homeRoute }
          )}
        >
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
      <Link href="/">
        <button
          className={classnames("nav-action", {
            "nav-action__active": view === "list",
          })}
          onClick={onViewList}
        >
          <ListIcon size="s" className="nav-action-button" />
          <span>Posts</span>
        </button>
      </Link>
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
