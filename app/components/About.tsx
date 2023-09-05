import {Button, Card, Modal, Space, Tabs} from "antd";

export default function About(props: { open: boolean; onClose: () => void }) {
  return (<>
      <Modal open={props.open} onOk={props.onClose} onCancel={props.onClose}>
        <Tabs
          items={[{
            key: "info", label: "Astolph0/place", children: (<Space direction="vertical">
                <p>
                  This is a project developed by Astolph0 on GitHub (formerly
                  also known as mldkyt or MLDKYT)
                </p>
                <Button
                  onClick={() => (location.href = "https://mldkyt.com/")}
                  type="primary"
                >
                  Main page
                </Button>
              </Space>),
          }, {
            key: "developer1", label: "Developer/Socials", children: (<Space direction="vertical">
                <span>Here are some of the socials of this developer: </span>
                <Card title="Discord">
                  My Discord invite is here!
                  <Button
                    type="link"
                    onClick={() => (location.href = "https://mldkyt.com/discord")}
                  >
                    Join
                  </Button>
                </Card>
                <Card title="More">
                  More social links are here:
                  <Button
                    type="link"
                    onClick={() => (location.href = "https://mldkyt.com/social")}
                  >
                    Visit
                  </Button>
                </Card>
              </Space>),
          },]}
        />
      </Modal>
    </>);
}
