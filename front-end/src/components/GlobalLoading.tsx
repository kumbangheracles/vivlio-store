import React from "react";
import styled from "styled-components";

const GlobalLoading: React.FC = () => {
  return (
    <>
      <div className="w-screen h-screen relative">
        <div className="m-auto p-[50px] z-[9999999999999999999999]">
          <Loader />
        </div>
      </div>
    </>
  );
};

const Loader = styled.div`
  color: #4400ff;
  font-size: 10px;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: mulShdSpin 1.3s infinite linear;
  transform: translateZ(0);
`;
export default GlobalLoading;
