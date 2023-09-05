import React from "react";
import {Modal, Typography} from "antd";

const currentVersion = "2";
const currentVersionString = "1.2";

export default function UpdateInformation() {
  const [visible, setVisible] = React.useState(false);
  const hasRan = React.useRef(false);

  React.useEffect(() => {
    if (hasRan.current) return;
    if (!localStorage.getItem("version")) {
      localStorage.setItem("version", currentVersion);
      return;
    }

    if (localStorage.getItem("version") !== currentVersion) {
      setVisible(true);
      localStorage.setItem("version", currentVersion);
    }

    hasRan.current = true;
  }, [setVisible, hasRan]);


  return (
    <Modal title="Update" open={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>
      <Typography.Title>New in {currentVersionString}</Typography.Title>
      <Typography.Paragraph>&bull; Fixed "Programmer Astolfo banned" dialog.</Typography.Paragraph>
      <Typography.Paragraph>&bull; Added Password Changing</Typography.Paragraph>
      <Typography.Paragraph>&bull; First time load greatly improved.</Typography.Paragraph>
    </Modal>
  )

}