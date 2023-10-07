import {Alert, Input, Modal, Space} from "antd";
import Image from "next/image";
import {useState} from "react";

export default function Login(props: {
  visible: boolean; close: () => void; logIn: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = () => {
    setLoading(true);
    fetch('/api/login', {
      method: "POST", body: JSON.stringify({username, password})
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
          props.logIn();
          props.close();
        }
      });
  };

  return (<Modal
      title="Log in"
      open={props.visible}
      onOk={login}
      onCancel={props.close}
      confirmLoading={loading}
      okText="Log in"
    >
      <Space direction="vertical" style={{width: "100%"}}>
        <Image src="/astolfo wave.png" width={200} alt="Astolfo waving"/>
        <span style={{fontStyle: "italic"}}>Hello there, and welcome back to Astolph0/place! Nice to meet you again :3</span>
        <span>Username</span>
        <Input
          type="text"
          value={username}
          onChange={(x) => setUsername(x.currentTarget.value)}
        />
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
