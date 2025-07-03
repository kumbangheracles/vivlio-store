import {
  Badge,
  Button,
  ConfigProvider,
  Input,
  Layout,
  Menu,
  type MenuProps,
  Select,
} from "antd";
import {
  BookFilled,
  CalendarFilled,
  CreditCardOutlined,
  DashOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BiSolidCategory } from "react-icons/bi";
const { Header, Content, Sider } = Layout;

const sidebarItems: MenuProps["items"] = [
  { key: "/dashboard", label: "Dashboard", icon: <DashOutlined /> },
  { key: "/category", label: "Category", icon: <BiSolidCategory /> },
];

interface PropTypes {
  children?: ReactNode;
}

const CmsLayout = ({ children }: PropTypes) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout>
      <Header
        style={{
          background: "#76b4e6",
          padding: "0 20px",
          position: "sticky",
          top: 0,
          zIndex: "9999",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 20 }}>Vivlio CMS</h1>
      </Header>
      <Layout>
        <Sider
          width={230}
          style={{
            background: "#76b4e6",

            height: "100vh",
          }}
        >
          <Menu
            style={{ backgroundColor: "#76b4e6" }}
            mode="inline"
            selectedKeys={[location.pathname]}
            items={sidebarItems}
            onClick={({ key }) => {
              if (key === "/logout") {
              } else {
                navigate(key);
              }
            }}
          />
        </Sider>
        <Layout style={{ padding: "24px" }}>
          <Content
            style={{
              background: "#fff",
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default CmsLayout;
