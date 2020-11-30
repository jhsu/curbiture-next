import classnames from "classnames";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import Button from "./Button/Button";

export const InstallBar = () => {
  const [beforeinstall, setBeforeinstall] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    function beforeInstallCallback(e) {
      e.preventDefault();
      setBeforeinstall(e);
    }
    function dismiss() {
      setDismissed(true);
    }
    window.addEventListener("beforeinstallprompt", beforeInstallCallback);
    window.addEventListener("appinstalled", dismiss);
    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallCallback);
      window.removeEventListener("appinstalled", dismiss);
    };
  }, []);

  const onInstall = useCallback(() => {
    if (beforeinstall) {
      beforeinstall.prompt();
      beforeinstall.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          setDismissed(true);
        }
      });
    }
  }, [beforeinstall]);

  return (
    <div
      className={classnames("install-bar", {
        hidden: dismissed,
      })}
    >
      <Button onClick={onInstall}>Install</Button>
    </div>
  );
};
