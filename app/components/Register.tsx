import { Alert, Input, Modal } from "antd";
import {useState} from "react";

export default function Register(props: { visible: boolean, close: () => void, logIn: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const login = () => {
    setLoading(true)
    fetch(`/api/register?username=${username}&password=${password}`).then(x => x.json()).then(x => {
      setLoading(false)
      if (x.error) {
        setError(x.error)
      } else {
        setUsername('')
        setPassword('')
        setError('')
        localStorage.setItem('token', x.token)
        props.logIn()
        props.close()
      }
    })
  }

  return (
    <Modal title='Register' open={props.visible} onOk={login} onCancel={props.close} confirmLoading={loading} okText='Register'>
      <img src='/astolfo wave.png' width={200} />
      <br/>
      <p style={{fontStyle: 'italic'}}>Astolfo is welcoming you :3</p>
      <p>Username</p>
      <Input type='text' value={username} onChange={x => setUsername(x.currentTarget.value)}/>
      <p>Password</p>
      <Input type='password' value={password} onChange={x => setPassword(x.currentTarget.value)}/>
      <br/>
      {error == '' || <Alert message={error} type="error" />}
    </Modal>
  );
}