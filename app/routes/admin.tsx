import {ActionFunction} from "@remix-run/node";
import {Alert, Button, Space, Table, Typography} from "antd";
import React, {useEffect, useRef} from "react";

export const action: ActionFunction = async ({request}) => {
  const body = await request.json();
  const token = request.headers.get("Authorization") ?? "";
  if (!body.action || !body.index) return new Response("Invalid request", {status: 400});
  const users = await (await fetch(`${process.env.FIREBASE}/users.json`)).json();
  const adminUser = users.find((user: any) => user.username === "astolfo");
  if (!adminUser) return new Response("Invalid request", {status: 400});
  if (!adminUser.tokens) adminUser.tokens = [];
  if (!adminUser.tokens.includes(token)) return new Response("Invalid request", {status: 400});

  if (body.action === "logout") {
    users[Number(body.index)].tokens = [];
    await fetch(`${process.env.FIREBASE}/users.json`, {
      method: "PUT", body: JSON.stringify(users),
    });
  }
  if (body.action === "delete") {
    users.splice(Number(body.index), 1);
    await fetch(`${process.env.FIREBASE}/users.json`, {
      method: "PUT", body: JSON.stringify(users),
    });
  }
};

export default function Admin() {
  const [users, setUsers] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string>("");

  const [currentlyDeletingIndex, setCurrentlyDeletingIndex] = React.useState<number>(-1);
  const [currentlyLoggingOutIndex, setCurrentlyLoggingOutIndex] = React.useState<number>(-1);

  const hasRan = useRef(false);

  useEffect(() => {
    if (hasRan.current) return;
    hasRan.current = true;
    fetch("/api/getusers", {
      headers: {
        Authorization: localStorage.getItem("token") ?? "",
      },
    })
      .then((x) => x.json())
      .then((x) => {
        if (!x.users) {
          setError("Error loading data");
          return;
        }
        console.log(x.users);
        setUsers(x.users);
      });
  }, [setUsers]);

  const logOutAll = async (i: number) => {
    setCurrentlyLoggingOutIndex(i);
    const res = await fetch("/admin", {
      method: "POST", headers: {
        Authorization: localStorage.getItem("token") ?? "",
      }, body: JSON.stringify({
        action: "logout", index: i,
      }),
    });
    if (res.status !== 200) {
      setError("Error while logging out");
      setCurrentlyLoggingOutIndex(-1);
    } else location.reload();
  };

  const deleteUser = async (i: number) => {
    setCurrentlyDeletingIndex(i);
    const res = await fetch("/admin", {
      method: "POST", headers: {
        Authorization: localStorage.getItem("token") ?? "",
      }, body: JSON.stringify({
        action: "delete", index: i,
      }),
    });
    if (res.status !== 200) {
      setError("Error while deleting");
      setCurrentlyDeletingIndex(-1);
    } else location.reload();
  };

  return (<div
      style={{
        position: "absolute", left: "0", top: "0", width: "100vw", minHeight: "100vh", backgroundColor: "black",
      }}
    >
      <div>
        <Typography.Title>Admin</Typography.Title>
        {error !== '' && <Alert type="error" message={error}/>}
        <Table
          columns={[{
            title: "Name", dataIndex: "username", key: "name",
          }, {
            title: "Action", key: "action", render: (_, rec, index) => (<Space size="small">
                <Button
                  loading={currentlyLoggingOutIndex === index}
                  onClick={() => logOutAll(index)}
                >
                  Log out all
                </Button>
                <Button
                  loading={currentlyDeletingIndex === index}
                  onClick={() => deleteUser(index)}
                >
                  Delete
                </Button>
              </Space>),
          },]}
          dataSource={users}
        />
      </div>
    </div>);
}
