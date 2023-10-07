import {Alert, Input, Modal, Space, Spin} from "antd";
import {ChangeEvent, useRef, useState} from "react";
import Image from "next/image";

export default function Register(props: {
  visible: boolean; close: () => void; logIn: () => void;
}) {
  const [username, setUsername] = useState("");
  const [usernameStartedEntering, setUsernameStartedEntering] = useState(false);
  const [usernameVerifying, setUsernameVerifying] = useState(false);
  const [usernameFree, setUsernameFree] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(setTimeout(() => {
  }, 0));

  const login = () => {
    setLoading(true);
    fetch(`/api/register`, {
      method: 'POST', body: JSON.stringify({
        username, password
      })
    })
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
          props.close();
          props.logIn();
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

  return (<Modal
      title="Register"
      open={props.visible}
      onOk={login}
      okButtonProps={{disabled: !usernameFree || usernameVerifying}}
      onCancel={props.close}
      confirmLoading={loading}
      okText="Register"
    >
      <Space direction="vertical" style={{width: "100%"}}>
        <Image src="/astolfo wave.png" alt="Astolfo waving"/>
        <span
          style={{fontStyle: "italic"}}>Hello there, and welcome to Astolph0/place! I am Astolfo, and you are~?</span>
        <span>Username</span>
        <Input type="text" value={username} onChange={usernameFieldUpdate}/>

        {usernameStartedEntering && (<>
            {usernameVerifying ? (<Space direction="horizontal">
                <Spin/>
                <span>
                  Verifying if <b>{username}</b> is available...
                </span>
              </Space>) : (<>
                <Alert
                  message={usernameFree ? `${username} is free!` : `${username} cannot be used: ${usernameError}`}
                  type={usernameFree ? "success" : "error"}
                />
              </>)}
          </>)}
        <span>Password</span>
        <Input
          type="password"
          value={password}
          onChange={(x) => setPassword(x.currentTarget.value)}
        />
        {error == "" || <Alert message={error} type="error"/>}
      </Space>
    </Modal>);
}
