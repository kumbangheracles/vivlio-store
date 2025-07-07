import { Input, InputProps } from "antd";
import { ReactNode } from "react";
import styled from "styled-components";

interface PropTypes extends InputProps {
  icon?: ReactNode;
}

const AppInput = ({ icon, ...props }: PropTypes) => {
  return (
    <>
      <CustomInput suffix={icon} {...props} />
    </>
  );
};

export default AppInput;

const CustomInput = styled(Input)`
  font-size: 14px;
  text-align: center;
  height: 38px;
  border: 1px solid gray;
  border-radius: 4px;
`;
