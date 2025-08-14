import { Select, SelectProps } from "antd";
import { ReactNode } from "react";
import { styled } from "styled-components";

interface PropTypes extends SelectProps {
  icon?: ReactNode;
}

const AppSelect = ({ ...props }: PropTypes) => {
  return (
    <>
      <CustomInput {...props} />
    </>
  );
};
export default AppSelect;
const CustomInput = styled(Select)`
  font-size: 14px;
  height: 38px;
`;
