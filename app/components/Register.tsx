import { Alert, Input, Modal, Space, Spin, Switch } from "antd";
import { ChangeEvent, useRef, useState } from "react";

export default function Register(props: {
  visible: boolean;
  close: () => void;
  logIn: () => void;
  logInStartTour: () => void;
}) {
  const [username, setUsername] = useState("");
  const [usernameStartedEntering, setUsernameStartedEntering] = useState(false);
  const [usernameVerifying, setUsernameVerifying] = useState(false);
  const [usernameFree, setUsernameFree] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tour, setTour] = useState(true);
  const timeoutRef = useRef(setTimeout(() => {}, 0));

  const login = () => {
    setLoading(true);
    fetch(`/api/register?username=${username}&password=${password}`)
      .then((x) => x.json())
      .then((x) => {
        setLoading(false);
        if (x.error) {
          setError(x.error);
        } else {
          setUsername("");
          setPassword("");
          setError("");
          localStorage.setItem("token", x.token);
          if (tour) {
            props.logInStartTour();
            props.close();
          } else {
            props.logIn();
            props.close();
          }
        }
      });
  };

  const verifyUsername = (username: string) => {
    fetch("/api/usernamefree?username=" + username)
      .then((x) => x.json())
      .then((x) => {
        setUsernameVerifying(false);
        setUsernameFree(!x.error);
        if (x.error) {
          setUsernameError(x.error);
        }
      });
  };

  const usernameFieldUpdate = (x: ChangeEvent<HTMLInputElement>) => {
    setUsernameStartedEntering(true);
    clearTimeout(timeoutRef.current);
    setUsername(x.target.value);
    setUsernameVerifying(true);
    timeoutRef.current = setTimeout(() => verifyUsername(x.target.value), 500);
  };

  return (
    <Modal
      title="Register"
      open={props.visible}
      onOk={login}
      okButtonProps={{disabled: !usernameFree || usernameVerifying}}
      onCancel={props.close}
      confirmLoading={loading}
      okText="Register"
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <img src="/astolfo wave.png" width={200} />
        <span style={{ fontStyle: "italic" }}>Hello there, and welcome to Astolph0/place! I am Astolfo, and you are~?</span>
        <span>Username</span>
        <Input type="text" value={username} onChange={usernameFieldUpdate} />

        {usernameStartedEntering && (
          <>
            {usernameVerifying ? (
              <Space direction="horizontal">
                <Spin />
                <span>
                  Verifying if <b>{username}</b> is available...
                </span>
              </Space>
            ) : (
              <>
                <Alert
                  message={
                    usernameFree
                      ? `${username} is free!`
                      : `${username} cannot be used: ${usernameError}`
                  }
                  type={usernameFree ? "success" : "error"}
                />
              </>
            )}
          </>
        )}
        <span>Password</span>
        <Input
          type="password"
          value={password}
          onChange={(x) => setPassword(x.currentTarget.value)}
        />
        <Space direction="horizontal">
          <Switch checked={tour} onChange={(x) => setTour(x)} />
          <span>Take a tour through the app</span>
        </Space>
        {tour || (
          <Alert message="You can always take the tour later from the sidebar menu" />
        )}
        {error == "" || <Alert message={error} type="error" />}
      </Space>
    </Modal>
  );
}
