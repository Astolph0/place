import type { V2_MetaFunction } from "@remix-run/node";
import MapRender from "~/components/MapRender";
import React, { useEffect, useRef } from "react";
import MapLoading from "~/components/MapLoading";
import TileWindow from "~/components/TileWindow";
import Login from "~/components/Login";
import Register from "~/components/Register";
import { Button, Drawer, Space } from "antd";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "r/place clone" },
    {
      name: "description",
      content: "Totally the best r/place clone, made by Astolfo himself.",
    },
    { name: "theme-color", content: "#ff8fff" },
  ];
};

const colours = ["r", "g", "b"];
let testMap = [] as string[][]; // 10x10 map for testing
for (let i = 0; i < 100; i++) {
  let arr = [];
  for (let j = 0; j < 100; j++) {
    arr.push(colours[Math.floor(Math.random() * colours.length)]);
  }
  testMap.push(arr);
}

export default function Index() {
  const [map, setMap] = React.useState(
    [] as { colour: string; user: string }[][]
  );
  const [showLogin, setShowLogin] = React.useState(false);
  const [showRegister, setShowRegister] = React.useState(false);
  const [showUserActions, setShowUserActions] = React.useState(false);

  const [loggedIn, setLoggedIn] = React.useState(false);
  const [loggedInUsername, setLoggedInUsername] = React.useState("");

  const [logoutLoading, setLogoutLoading] = React.useState(false);

  const refreshMap = () => {
    fetch("/api/getGrid")
      .then((x) => x.json())
      .then((x) => {
        setMap(x as { colour: string; user: string }[][]);
      });
  };

  const [tileWindow, setTileWindow] = React.useState({
    x: 0,
    y: 0,
    visible: false,
  } as {
    x: number;
    y: number;
    visible: boolean;
  });

  const tileSelected = (x: number, y: number) => {
    setTileWindow({ x, y, visible: true });
  };

  const refreshUser = () => {
    fetch("/api/getUser", {
      headers: {
        Authorization: localStorage.getItem("token") ?? "",
      },
    })
      .then((x) => x.json())
      .then((x) => {
        if (x.error) {
          localStorage.removeItem("token");
          setLoggedIn(false);
        } else {
          setLoggedIn(true);
          setLoggedInUsername(x.username);
        }
      });
  };

  const logOut = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  const logOutAll = () => {
    setLogoutLoading(true);
    fetch("/api/logoutall", {
      headers: {
        Authorization: localStorage.getItem("token") ?? "",
      },
    }).then((x) => {
      setLogoutLoading(false);
      if (x.status === 200) {
        localStorage.removeItem("token");
        setLoggedIn(false);
      }
    });
  };

  const hasRan = useRef(false);

  useEffect(() => {
    if (hasRan.current) {
      return;
    }
    hasRan.current = true;
    refreshMap();
    if (
      !loggedIn &&
      localStorage.getItem("token") !== "" &&
      localStorage.getItem("token") !== null
    ) {
      refreshUser();
    }
  }, [setMap, refreshMap]);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <div style={{ position: "sticky", left: "0", top: "0" }}>
        {map.length == 0 && <MapLoading />}
        {map.length == 0 || <MapRender map={map} onTileSelect={tileSelected} />}
      </div>
      {
        <TileWindow
          x={tileWindow.x}
          y={tileWindow.y}
          map={map}
          visible={tileWindow.visible}
          close={() => setTileWindow({ ...tileWindow, visible: false })}
          updateTiles={() => refreshMap()}
        />
      }

      {
        <Login
          visible={showLogin}
          logIn={refreshUser}
          close={() => {
            setShowLogin(false);
            setShowUserActions(true);
          }}
        />
      }

      {
        <Register
          visible={showRegister}
          logIn={refreshUser}
          close={() => {
            setShowRegister(false);
            setShowUserActions(true);
          }}
        />
      }

      <Button
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
        }}
        onClick={() => setShowUserActions(true)}
        type="primary"
      >
        User ({loggedIn ? `logged in as ${loggedInUsername}` : "not logged in"})
      </Button>
      <Drawer open={showUserActions} onClose={() => setShowUserActions(false)}>
        <Space direction="vertical">
          <h1>Profile information</h1>
          {loggedIn ? (
            <>
              <p>You are currently logged in as {loggedInUsername}</p>
              <Button onClick={logOut}>Log out</Button>
              <Button onClick={logOutAll} loading={logoutLoading}>
                Log out all devices
              </Button>
            </>
          ) : (
            <>
              <p>You are not logged in</p>
              <Button
                onClick={() => {
                  setShowLogin(true);
                  setShowUserActions(false);
                }}
              >
                Log in
              </Button>
              <Button
                onClick={() => {
                  setShowRegister(true);
                  setShowUserActions(false);
                }}
              >
                Register
              </Button>
            </>
          )}

          <h1>Feature suggestion</h1>
          <p>
            If you have a suggestion, or want to report a bug, suggest on this
            Google form:
          </p>
          <Button
            type="link"
            href="https://docs.google.com/forms/d/e/1FAIpQLSdf3skJgzlf5EsvwZKdZMshuk8jQPnk9tsFSfzu87Mg6vpkRQ/viewform?usp=sf_link"
          >
            Open Google Form
          </Button>
          <p>
            You can also suggest new features under the art post in Zen's
            Discord (if you're there)
          </p>
        </Space>
      </Drawer>
    </div>
  );
}
