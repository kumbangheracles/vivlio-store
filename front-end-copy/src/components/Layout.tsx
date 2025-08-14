"use client";
import React, { type ReactNode } from "react";
import styled from "styled-components";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}
const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <WrapperLayout>
        <Navbar />
        <WrapperChildren>{children}</WrapperChildren>
        <Footer />
      </WrapperLayout>
    </>
  );
};

const WrapperLayout = styled.div`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  position: relative;
`;

const WrapperChildren = styled.div`
  margin-block: 80px;
`;

export default AppLayout;
