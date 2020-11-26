import classnames from "classnames";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { AddPosting } from "../components/admin/AddPost";
import { RequireLogin } from "../components/admin/RequireLogin";
import Button from "../components/Button/Button";
import { FacebookLogin } from "../components/FacebookLogin";
import { useFirestore } from "../components/firebase";
import { Mapper } from "../components/Mapper/Mapper";
import { Posts } from "../components/Posts";
import {
  CrosshairIcon,
  ListIcon,
  MapIcon,
  PlusIcon,
  UserIcon,
} from "../components/SvgIcon";
import { useFirebaseLocations } from "../hooks/firebase";
import { activeView, clearPostSelection, selectedLocationAtom } from "../store";

const NavBar = () => {
  const [view, setView] = useAtom(activeView);
  // const [, setSelectedPost] = useAtom(selectedLocationAtom);
  const [, clearSelection] = useAtom(clearPostSelection);

  const onAddPost = useCallback(() => void setView("add-post"), [setView]);
  const onViewMap = useCallback(() => void setView("map"), [setView]);
  const onViewList = useCallback(() => {
    clearSelection();
    setView("list");
  }, [setView]);

  return (
    <nav className="bottom-nav">
      <div className="nav-actions absolute right-4 bottom-20 flex flex-col">
        {view === "map" && (
          <Button icon onClick={onViewMap} className={classnames("shadow-md")}>
            <CrosshairIcon size="m" />
          </Button>
        )}
        <RequireLogin>
          {view !== "add-post" && (
            <Button
              icon
              onClick={onAddPost}
              className={classnames("shadow-md")}
            >
              <PlusIcon size="m" />
            </Button>
          )}
        </RequireLogin>
      </div>
      <button
        className={classnames("nav-action", {
          "nav-action__active": false,
        })}
      >
        <UserIcon size="s" className="nav-action-button" />
        <span>User</span>
      </button>
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
  const db = useFirestore();
  const [selectedId, setSelectedPost] = useAtom(selectedLocationAtom);
  useFirebaseLocations({ db });

  const [view] = useAtom(activeView);

  const onBack = useCallback(() => void setSelectedPost(null), [
    setSelectedPost,
  ]);
  return (
    <div className="flex flex-col h-screen">
      <FacebookLogin />
      <div className="flex-1 h-full overflow-auto flex flex-row">
        <div
          className={classnames(
            "bg-gray-100",
            "w-full md:w-1/3 md:max-w-xs h-full overflow-auto flex flex-col",
            {
              hidden: view === "map",
            }
          )}
        >
          {view === "add-post" && (
            <RequireLogin>
              <AddPosting />
            </RequireLogin>
          )}
          {view === "list" && <Posts />}
        </div>
        <div className={classnames("flex-1 map-container")}>
          <Mapper active={view === "map"} />
        </div>
        <NavBar />
      </div>
    </div>
  );
}
