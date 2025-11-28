"use client";
import "aos/dist/aos.css";
import "@ant-design/v5-patch-for-react-19";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AOS from "aos";
import React, { Suspense, useEffect, type ReactNode } from "react";
import styled, { StyleSheetManager } from "styled-components";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { UserProperties } from "@/types/user.type";
import { ConfigProvider } from "antd";
import GlobalLoading from "./GlobalLoading";
import { StyleProvider } from "@ant-design/cssinjs";
import isPropValid from "@emotion/is-prop-valid";
import { usePathname } from "next/navigation";
import AntdRegistry from "@/libs/AntdRegistry";
import useDeviceType from "@/hooks/useDeviceType";
interface LayoutProps {
  children: ReactNode;
  dataUser?: UserProperties;
  isAuthPageTampil?: boolean;
}
const AppLayout: React.FC<LayoutProps> = ({ children, dataUser }) => {
  const pathname = usePathname();
  const isMobile = useDeviceType();
  const isPageAuth = pathname.startsWith("/auth");
  const isResult = pathname.startsWith("/result");
  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY as string;
    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <>
      <AntdRegistry>
        <ConfigProvider>
          <StyleSheetManager shouldForwardProp={isPropValid}>
            <StyleProvider hashPriority="high">
              {isPageAuth || isResult ? (
                <>{children}</>
              ) : (
                <>
                  <WrapperLayout>
                    <Navbar dataUser={dataUser} />
                    <WrapperChildren isMobile={isMobile}>
                      <Suspense fallback={<GlobalLoading />}>
                        {children}
                      </Suspense>
                    </WrapperChildren>
                    <Footer />
                  </WrapperLayout>
                </>
              )}
            </StyleProvider>
          </StyleSheetManager>
        </ConfigProvider>
      </AntdRegistry>
    </>
  );
};

const WrapperLayout = styled.div`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  position: relative;
`;

interface WrapperProps {
  isMobile?: boolean;
}

const WrapperChildren = styled.div<WrapperProps>`
  margin-block: 80px;
  /* min-height: ${({ isMobile }) => (isMobile ? "200vh" : "auto")}; */
`;

export default AppLayout;
