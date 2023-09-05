import {CheckOutlined, CopyOutlined} from "@ant-design/icons";
import {Input, Modal, Typography} from "antd";
import {useEffect, useRef, useState} from "react";

export default function AstolfoBan() {
  const [usernameCopied, setUsernameCopied] = useState(false);

  const [show, setShow] = useState(false);

  const hasRan = useRef(false);

  const copyUsername = () => {
    setUsernameCopied(true);
    navigator.clipboard.writeText("astolf0.");
    setTimeout(() => setUsernameCopied(false), 1000);
  };

  const close = () => {
    setShow(false);
  };

  useEffect(() => {
    if (!hasRan.current) {
      hasRan.current = true;
      setShow(true);
    }
  }, []);

  return (<>
      <Modal
        open={show}
        centered
        title="Programmer Astolfo was banned from Zen's Discord"
        onOk={close}
        onCancel={close}
      >
        <Typography>
          Please take the time to send a friend request to Programmer Astolfo
          below:
        </Typography>
        <Input
          readOnly
          value="astolf0."
          addonAfter={usernameCopied ? (<CheckOutlined/>) : (<CopyOutlined onClick={copyUsername}/>)}
        />
        <Typography>
          You can send him cool suggestion to add to the site, or just say hi!
        </Typography>
      </Modal>
    </>);
}
