import React from "react";
import styled from "styled-components";
import Navbar from "./Navbar";
export default function Layout({ children }) {
  return (
    <>
      <WrapperLayout>
        <Navbar />
        <WrapperChildren>{children}</WrapperChildren>
      </WrapperLayout>
    </>
  );
}

const WrapperLayout = styled.div`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  position: relative;
`;

const WrapperChildren = styled.div`
  margin-top: 80px;
`;
