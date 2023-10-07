import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
import { Modal, Button, Input, Typography } from "antd";
import React from "react";

export default function DeprecationWarningPopup() {
  const [visible, setVisible] = React.useState(true);
  const [usernameCopied, setUsernameCopied] = React.useState(false);

  const projectList = () => {
    document.location.href = "https://mldkyt.com/projects";
  };

  const socialLinks = () => {
    document.location.href = "https://mldkyt.com/social";
  };

  const copyUsername = () => {
    setUsernameCopied(true);
    navigator.clipboard.writeText("programmer.astolfo");
    setTimeout(() => setUsernameCopied(false), 1000);
  };

  const tiktok = () => {
    document.location.href = "https://tiktok.com/@programmer.astolfo";
  }

  return (
    <Modal
      title="This site is deprecated and will be removed soon."
      open={visible}
      onOk={() => setVisible(false)}
      footer={[
        <Button key={1} onClick={tiktok}>TikTok</Button>,
        <Button key={2} onClick={projectList}>Projects</Button>,
        <Button key={3} onClick={socialLinks}>Social Links</Button>,
        <Button key={4} onClick={() => setVisible(false)}>Close</Button>,
      ]}
    >
      <h1 className="text-3xl font-bold">Deprecated</h1>
      <h2 className="text-xl font-bold">
        This project was deprecated on 4/10/23 and will be taken down on
        31/10/23.
      </h2>
      <Typography>
        I want to focus on other projects, and this project is not one of them.
        I will be taking down this project on the 30th of October 2023, and I
        will not be providing any support for it after that date. Hopefully you
        enjoyed this project while it lasted, and I hope you enjoy my future
        projects.
      </Typography>
      <p className="font-bold">
        You can still send me a friend request on Discord:
      </p>
      <Input
        readOnly
        value="programmer.astolfo"
        addonAfter={
          usernameCopied ? (
            <CheckOutlined />
          ) : (
            <CopyOutlined onClick={copyUsername} />
          )
        }
      />
    </Modal>
  );
}
