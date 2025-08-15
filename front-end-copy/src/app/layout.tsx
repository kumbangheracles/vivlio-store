"use client";
import "@ant-design/v5-patch-for-react-19";
import AOS from "aos";
import "aos/dist/aos.css";
import AuthProvider from "@/components/AuthProvider";
import { ReactNode, useEffect } from "react";
import "./globals.css";
import AppLayout from "@/components/Layout";
import { Suspense } from "react";
import GlobalLoading from "@/components/GlobalLoading";
import { ConfigProvider } from "antd";
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";
interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  // useEffect(() => {
  //   AOS.init();
  // }, []);
  return (
    <html lang="en">
      <body>
        <StyleSheetManager shouldForwardProp={isPropValid}>
          <ConfigProvider>
            <AuthProvider>
              <Suspense fallback={<GlobalLoading />}>{children}</Suspense>
            </AuthProvider>
          </ConfigProvider>
        </StyleSheetManager>
      </body>
    </html>
  );
}
