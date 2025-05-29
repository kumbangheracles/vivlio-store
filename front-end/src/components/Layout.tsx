import React, { type ReactNode } from "react";
import styled from "styled-components";
import Navbar from "./Navbar";
interface LayoutProps {
  children: ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <WrapperLayout>
        <Navbar />
        <WrapperChildren>{children}</WrapperChildren>
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
  margin-top: 80px;
`;

export default Layout;
