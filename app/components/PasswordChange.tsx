import {Input, Modal, Typography} from "antd";
import {useState} from "react";

export default function PasswordChange(props: {
  visible: boolean; close: () => void;
}) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const changePassword = () => {
    setLoading(true);
    fetch('/api/changepassword', {
      method: 'POST', headers: {
        Authorization: localStorage.getItem('token') ?? ''
      }, body: JSON.stringify({
        password
      })
    }).then(x => {
      if (x.status == 200) {
        setLoading(false);
        setPassword('');
        props.close();
      } else {
        x.text().then(x => {
          setError(x);
        })
      }
    })
  };

  return (<>
      <Modal open={props.visible} onCancel={props.close} onOk={changePassword} confirmLoading={loading}
             title='Change Password'>
        <Typography.Text>Enter your new password below:</Typography.Text>
        <Input.Password
          value={password}
          onChange={(x) => setPassword(x.target.value)}
        />
        {error == "" || <Typography.Text type='danger'>{error}</Typography.Text>}
      </Modal>
    </>);
}
