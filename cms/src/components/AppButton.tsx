import { Button } from "antd";
import { ReactNode } from "react";
import { styled } from "styled-components";
// import { ButtonProps } from "antd";
interface PropTypes {
  color?: "primary" | "danger" | "normal";
  label?: string;
  icon?: ReactNode;
  style?: React.CSSProperties;
  //   children?: ReactNode;
}

const getColor = (color?: string) => {
  switch (color) {
    case "primary":
      return {
        border: "1px solid rgba(144, 202, 249, 1)",
        color: "white",
        backgroundColor: "rgba(144, 202, 249, 1)",
      };
    case "danger":
      return {
        border: "1px solid rgba(255, 150, 148, 1)",
        color: "white",
        backgroundColor: "rgba(255, 150, 148, 1)",
      };
    case "normal":
      return {
        border: "1px solid #000000",
        color: "#ffffff",
        backgroundColor: "#000000",
      };
    default:
      return {
        border: "1px solid rgba(176, 176, 176, 1)",
        color: "rgba(69, 69, 69, 1)",
        backgroundColor: "rgba(176, 176, 176, 1)",
      };
  }
};

const AppButton: React.FC<PropTypes> = ({ label, color, icon, style }) => {
  return (
    <MyButton icon={icon} style={{ ...getColor(color), ...style }}>
      {label}
    </MyButton>
  );
};

export default AppButton;

const MyButton = styled(Button)<{ padding?: string }>`
  padding: ${({ padding }) => (padding ? padding : "0px 14px")};
  font-size: 14px;
  text-align: center;
  height: 48px;
  border-radius: 4px;
  font-weight: 700;

  &:disabled {
    background-color: #d4d4d8 !important;
    color: #fff;
    border: 1px solid #d4d4d8;
    font-weight: 600;
  }
`;
