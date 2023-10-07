import About from "@/components/About";
import DeprecationWarningCorner from "@/components/DeprecationWarningCorner";
import DeprecationWarningPopup from "@/components/DeprecationWarningPopup";
import Login from "@/components/Login";
import MapLoading from "@/components/MapLoading";
import MapRender from "@/components/MapRender";
import PasswordChange from "@/components/PasswordChange";
import Register from "@/components/Register";
import TileWindow from "@/components/TileWindow";
import { Alert, Button, Drawer, Popconfirm, Space, Typography } from "antd";
import Head from "next/head";
import React, { useRef, useEffect } from "react";

export default function Index() {
  const [map, setMap] = React.useState(
    [] as { colour: string; user: string }[][]
  );
  const [showLogin, setShowLogin] = React.useState(false);
  const [showRegister, setShowRegister] = React.useState(false);
  const [showUserActions, setShowUserActions] = React.useState(false);

  const [logoutAllConfirm, setLogoutAllConfirm] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [loggedInUsername, setLoggedInUsername] = React.useState("");

  const [passwordChange, setPasswordChange] = React.useState(false);

  const [accountDeleteConfirm, setAccountDeleteConfirm] = React.useState(false);
  const [accountDeleteError, setAccountDeleteError] = React.useState("");

  const [about, setAbout] = React.useState(false);

  const [version, setVersion] = React.useState("");

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
    return new Promise((resolve) => {
      fetch("/api/logoutall", {
        headers: {
          Authorization: localStorage.getItem("token") ?? "",
        },
      }).then((x) => {
        resolve(null);
        setLogoutAllConfirm(false);
        if (x.status === 200) {
          localStorage.removeItem("token");
          setLoggedIn(false);
        }
      });
    });
  };

  const deleteAccount = () => {
    return new Promise((resolve) => {
      fetch("/api/deleteaccount", {
        headers: {
          Authorization: localStorage.getItem("token") ?? "",
        },
      })
        .then((x) => x.json())
        .then((x) => {
          resolve(null);
          setAccountDeleteConfirm(false);
          if (x.success) {
            localStorage.removeItem("token");
            setLoggedIn(false);
          } else {
            setAccountDeleteError(x.error);
          }
        });
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

    fetch("/api/versioninfo")
      .then((x) => x.json())
      .then((x) => {
        setVersion(x.commitSha);
      });

    const updating = setInterval(refreshMap, 30000);
    return () => clearInterval(updating);
  }, [setMap, refreshMap, loggedIn]);

  return (
    <div>
      <Head>
        <meta name="title" content="r/place clone" />
        <meta
          name="description"
          content="Totally the best r/place clone, made by Astolfo himself."
        />
        <meta name="theme-color" content="#ff8fff" />
      </Head>
      <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
        <div style={{ position: "sticky", left: "0", top: "0" }}>
          {map.length == 0 && <MapLoading />}
          {map.length == 0 || (
            <MapRender map={map} onTileSelect={tileSelected} />
          )}
        </div>

        <TileWindow
          x={tileWindow.x}
          y={tileWindow.y}
          map={map}
          visible={tileWindow.visible}
          close={() => setTileWindow({ ...tileWindow, visible: false })}
          updateTiles={() => refreshMap()}
        />

        <Login
          visible={showLogin}
          logIn={refreshUser}
          close={() => {
            setShowLogin(false);
            setShowUserActions(true);
          }}
        />

        <Register
          visible={showRegister}
          logIn={refreshUser}
          close={() => {
            setShowRegister(false);
            setShowUserActions(true);
          }}
        />

        <PasswordChange
          visible={passwordChange}
          close={() => {
            setPasswordChange(false);
            setShowUserActions(true);
          }}
        />

        <Button
          style={{
            position: "fixed",
            top: "60px",
            right: "20px",
          }}
          onClick={() => setShowUserActions(true)}
          type="primary"
        >
          User (
          {loggedIn ? (
            <>
              logged in as <b>{loggedInUsername}</b>
            </>
          ) : (
            "not logged in"
          )}
          )
        </Button>
        <Drawer
          open={showUserActions}
          onClose={() => setShowUserActions(false)}
        >
          <Space direction="vertical">
            <Typography>
              <Typography.Title>Profile information</Typography.Title>
            </Typography>
            {loggedIn ? (
              <>
                <Typography>
                  You are currently logged in as {loggedInUsername}
                </Typography>
                <Button onClick={logOut}>Log out</Button>
                <Popconfirm
                  title={"Really log out of all devices?"}
                  open={logoutAllConfirm}
                  onConfirm={logOutAll}
                  onCancel={() => setLogoutAllConfirm(false)}
                >
                  <Button onClick={() => setLogoutAllConfirm(true)}>
                    Log out all devices
                  </Button>
                </Popconfirm>
                <Button
                  onClick={() => {
                    setPasswordChange(true);
                    setShowUserActions(false);
                  }}
                >
                  Change account password
                </Button>
                <Popconfirm
                  title="Really delete account?"
                  open={accountDeleteConfirm}
                  onConfirm={deleteAccount}
                  onCancel={() => setAccountDeleteConfirm(false)}
                >
                  <Button onClick={() => setAccountDeleteConfirm(true)}>
                    Delete account
                  </Button>
                </Popconfirm>
                {accountDeleteError == "" || (
                  <Alert message={accountDeleteError} type="error" />
                )}
              </>
            ) : (
              <>
                <Typography>You are not logged in</Typography>
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

            <Typography>
              <Typography.Title>Feature suggestion</Typography.Title>
              <Typography.Paragraph>
                If you have a suggestion, or want to report a bug, suggest on
                this Google form:
              </Typography.Paragraph>
              <Button
                type="link"
                href="https://docs.google.com/forms/d/e/1FAIpQLSdf3skJgzlf5EsvwZKdZMshuk8jQPnk9tsFSfzu87Mg6vpkRQ/viewform?usp=sf_link"
              >
                Open Google Form
              </Button>
            </Typography>
            <Button onClick={() => setAbout(true)}>About Astolph0/place</Button>
          </Space>
        </Drawer>

        <About open={about} onClose={() => setAbout(false)} />

        <DeprecationWarningCorner />
        <DeprecationWarningPopup />

        <Typography
          style={{
            position: "fixed",
            left: "2px",
            bottom: "2px",
            fontSize: "12px",
            color: "white",
          }}
        >
          Astolph0/place 1.2{version == "" || `-${version}`}
        </Typography>
      </div>
    </div>
  );
}
