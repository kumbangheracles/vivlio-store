import styled from "styled-components";
import { Modal, ModalProps } from "antd";
import { ReactNode } from "react";

interface PropTypes extends ModalProps {
  okButton?: ReactNode;
  cancelButton?: ReactNode;
  style?: React.CSSProperties;
  content?: ReactNode;
  titleStyle?: React.CSSProperties;
  footerContent?: ReactNode;
  children?: ReactNode;
}

const AppModal = ({
  okButton,
  cancelButton,
  titleStyle,
  style,
  content,
  title,
  footer,
  footerContent,
  children,
  ...rest
}: PropTypes) => {
  return (
    <CustomModal style={{ ...style }} footer={footer} {...rest}>
      {children ? (
        children
      ) : (
        <>
          {title && <h3 style={titleStyle}>{title}</h3>}
          {content && <div>{content}</div>}
          {footerContent && <div>{footerContent}</div>}
        </>
      )}
    </CustomModal>
  );
};

const CustomModal = styled(Modal)`
  text-align: center;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default AppModal;
