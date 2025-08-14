import { Col, Row, Typography } from "antd";
import { ReactNode } from "react";
interface PropTypes {
  sectionTitle: string;
  sectionSubTitle: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

const { Title, Text } = Typography;

const HeaderSection = ({
  sectionSubTitle,
  sectionTitle,
  style,
  children,
}: PropTypes) => {
  return (
    <Row style={style} justify={"space-between"}>
      <Col span={5}>
        <Title level={5}>{sectionTitle}</Title>
        <Text type="secondary">{sectionSubTitle}</Text>
      </Col>
      <Col span={15}>{children}</Col>
    </Row>
  );
};

export default HeaderSection;
