import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
import { Alert, Input, Modal, Typography } from "antd";
import { useEffect, useRef, useState } from "react";

export default function AstolfoBan() {
  const [usernameCopied, setUsernameCopied] = useState(false);

  const [newNick1Copied, setNewNick1Copied] = useState(false);
  const [newNick2Copied, setNewNick2Copied] = useState(false);
  const [newNick3Copied, setNewNick3Copied] = useState(false);
  const [newNick4Copied, setNewNick4Copied] = useState(false);

  const [show, setShow] = useState(false);

  const [cancelError, setCancelError] = useState(false);
  const hasRan = useRef(false);

  const copyUsername = () => {
    setUsernameCopied(true);
    // copy "astolf0." to clipboard
    navigator.clipboard.writeText("astolf0.");
    setTimeout(() => setUsernameCopied(false), 1000);
  };

  const copyNewNick1 = () => {
    setNewNick1Copied(true);
    // copy "#UnbanProgrammerAstolfo" to clipboard
    navigator.clipboard.writeText("#UnbanProgrammerAstolfo");
    setTimeout(() => setNewNick1Copied(false), 1000);
  };

  const copyNewNick2 = () => {
    setNewNick2Copied(true);
    // copy "#UnbanAstolfo" to clipboard
    navigator.clipboard.writeText("#UnbanAstolfo");
    setTimeout(() => setNewNick2Copied(false), 1000);
  };

  const copyNewNick3 = () => {
    setNewNick3Copied(true);
    // copy "#UnbanAstolf0" to clipboard
    navigator.clipboard.writeText("#UnbanAstolf0");
    setTimeout(() => setNewNick3Copied(false), 1000);
  };

  const copyNewNick4 = () => {
    setNewNick4Copied(true);
    // copy "#BringBackProgrammerAstolfo" to clipboard
    navigator.clipboard.writeText("#BringBackProgrammerAstolfo");
    setTimeout(() => setNewNick4Copied(false), 1000);
  };

  const close = () => {
    setCancelError(false);
    setShow(false);
  };

  useEffect(() => {
    if (hasRan.current) return;
    hasRan.current = true;
    setTimeout(() => setShow(true), 1000);
  });

  return (
    <>
      <Modal
        open={show}
        centered
        title="Programmer Astolfo was banned from Zen's Discord"
        onOk={close}
        onCancel={() => setCancelError(true)}
      >
        <Typography>
          Please take the time to send a friend request to Programmer Astolfo
          below:
        </Typography>
        <Input
          readOnly
          value="astolf0."
          addonAfter={
            usernameCopied ? (
              <CheckOutlined />
            ) : (
              <CopyOutlined onClick={copyUsername} />
            )
          }
        />
        <Typography>
          You can send him cool suggestion to add to the site, or just say hi!
        </Typography>
        <Typography>
          It would also be cool to set your nickname to one of the following:
        </Typography>
        <Input
          readOnly
          value="#UnbanProgrammerAstolfo"
          addonAfter={
            newNick1Copied ? (
              <CheckOutlined />
            ) : (
              <CopyOutlined onClick={copyNewNick1} />
            )
          }
        />
        <Input
          readOnly
          value="#UnbanAstolfo"
          addonAfter={
            newNick2Copied ? (
              <CheckOutlined />
            ) : (
              <CopyOutlined onClick={copyNewNick2} />
            )
          }
        />
        <Input
          readOnly
          value="#UnbanAstolf0"
          addonAfter={
            newNick3Copied ? (
              <CheckOutlined />
            ) : (
              <CopyOutlined onClick={copyNewNick3} />
            )
          }
        />
        <Input
          readOnly
          value="#BringBackProgrammerAstolfo"
          addonAfter={
            newNick4Copied ? (
              <CheckOutlined />
            ) : (
              <CopyOutlined onClick={copyNewNick4} />
            )
          }
        />
        <Typography>Thank you for your support!</Typography>
        {cancelError && (
          <>
            <Alert
              message="NotImplementedException: Not Implemented"
              type="error"
            />
          </>
        )}
      </Modal>
    </>
  );
}
