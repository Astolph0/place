import { ConfigProvider, theme } from "antd";
import { HappyProvider } from "@ant-design/happy-work-theme";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <ConfigProvider
          theme={{
            algorithm: [theme.darkAlgorithm],
          }}
        >
          <HappyProvider>
            <Main />
          </HappyProvider>
        </ConfigProvider>
        <NextScript />
      </body>
    </Html>
  );
}
