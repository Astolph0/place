import { Alert, Button } from "antd";

export default function DeprecationWarningCorner() {
    return <Alert
        type="warning"
        message="This site is deprecated and will be removed soon. I have other projects I want to focus on, and this is not one of them."
        banner
    />
}