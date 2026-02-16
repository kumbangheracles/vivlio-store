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
import { createCache, StyleProvider } from "@ant-design/cssinjs";
import isPropValid from "@emotion/is-prop-valid";
import { usePathname } from "next/navigation";
import AntdRegistry from "@/libs/AntdRegistry";
import useDeviceType from "@/hooks/useDeviceType";
import { CategoryProps } from "@/types/category.types";
import { BookProps } from "@/types/books.type";
import { GenreProperties } from "@/types/genre.type";
import { useOverlayStore } from "@/zustand/useOverlay.store";
interface LayoutProps {
  children: ReactNode;
  dataUser?: UserProperties;
  isAuthPageTampil?: boolean;
  dataCategories?: CategoryProps[];
  dataCartedBooks?: BookProps[];
  dataGenres?: GenreProperties[];
  dataBooks?: BookProps[];
  allBooks?: BookProps[];
}
const AppLayout: React.FC<LayoutProps> = ({
  children,
  dataUser,
  dataCategories,
  dataCartedBooks,
  dataGenres,
  dataBooks,
}) => {
  const pathname = usePathname();
  const isMobile = useDeviceType();
  const { isOverlay, setIsOverlay } = useOverlayStore();
  const cache = createCache();
  const isPageAuth = pathname.startsWith("/auth");
  const isResult = pathname.startsWith("/result");
  useEffect(() => {
    AOS.init({
      once: true,
      mirror: false,
      duration: 800,
    });
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
      <ConfigProvider>
        <AntdRegistry>
          <StyleSheetManager shouldForwardProp={isPropValid}>
            <StyleProvider cache={cache} hashPriority="high">
              {isPageAuth || isResult ? (
                <>{children}</>
              ) : (
                <>
                  <WrapperLayout>
                    <Navbar
                      dataGenres={dataGenres}
                      dataUser={dataUser}
                      dataCategories={dataCategories}
                      dataCartedBooks={dataCartedBooks}
                      dataBooks={dataBooks}
                    />
                    <WrapperChildren isMobile={isMobile}>
                      <Suspense fallback={<GlobalLoading />}>
                        {children}
                      </Suspense>
                      {isOverlay && (
                        <div
                          onClick={() => setIsOverlay(false)}
                          className="inset-0 bg-black/50 transition-opacity duration-300 top-0 left-0 fixed h-screen w-screen z-[40]"
                        ></div>
                      )}
                    </WrapperChildren>
                    <Footer />
                  </WrapperLayout>
                </>
              )}
            </StyleProvider>
          </StyleSheetManager>
        </AntdRegistry>
      </ConfigProvider>
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
  /* min-height: 100vh; */
  /* min-height: ${({ isMobile }) => (isMobile ? "200vh" : "auto")}; */
`;

export default AppLayout;
