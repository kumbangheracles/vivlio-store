import {
  Badge,
  Button,
  Card,
  ConfigProvider,
  Dropdown,
  Input,
  Layout,
  Menu,
  type MenuProps,
  message,
  Modal,
  Select,
} from "antd";
import {
  BookFilled,
  CalendarFilled,
  CreditCardOutlined,
  DashOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useState, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BiSolidCategory } from "react-icons/bi";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { ErrorHandler } from "../../helper/handleError";
import myAxios from "../../helper/myAxios";
import { UserProperties } from "../../types/user.type";
import { styled } from "styled-components";
const { Header, Content, Sider } = Layout;

const sidebarItems: MenuProps["items"] = [
  { key: "/", label: "Dashboard", icon: <DashOutlined /> },
  { key: "/category", label: "Category", icon: <BiSolidCategory /> },
];

interface PropTypes {
  children?: ReactNode;
}

const AppLayout = ({ children }: PropTypes) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const auth = useAuthUser<UserProperties>();
  const [collapsed, setCollapsed] = useState(false);
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();
  const [isHover, setIshover] = useState<boolean>(false);

  const handleLogout = async () => {
    try {
      await myAxios.post("/auth/logout");
      message.info("Logout Success");
      // localStorage.removeItem("user");

      navigate("/login");
    } catch (error) {
      console.log("Error Logout: ", error);
      ErrorHandler(error);
    } finally {
      signOut();
    }
  };

  const items = isAuthenticated
    ? [
        {
          key: isAuthenticated ? "profile" : "",
          label: isAuthenticated ? "Profile" : "",
          // onClick: () => handleEdit(record.articleId),
        },
        {
          key: isAuthenticated ? "logout" : "login",
          label: isAuthenticated ? "Logout" : "Login",
          onClick: () => {
            isAuthenticated ? setIsOpen(true) : navigate("/login");
          },
        },
      ]
    : [
        {
          key: isAuthenticated ? "logout" : "login",
          label: isAuthenticated ? "Logout" : "Login",
          onClick: () => {
            isAuthenticated ? setIsOpen(true) : navigate("/login");
          },
        },
      ];
  return (
    <>
      <Layout>
        <Header
          style={{
            background: "#76b4e6",
            padding: "0 20px",
            position: "sticky",
            top: 0,
            zIndex: "9999",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h1 style={{ margin: 0, fontSize: 20 }}>Vivlio CMS</h1>
          <div
            onMouseEnter={() => setIshover(true)}
            onMouseLeave={() => setIshover(false)}
          >
            <Dropdown
              overlayStyle={{ zIndex: "1000000" }}
              trigger={["click"]}
              menu={{
                items: items,
              }}
            >
              <AccountIcon isTriggered={isHover}>
                <img
                  style={{ objectFit: "contain", cursor: "pointer" }}
                  src="/icons/account.svg"
                  alt="account-icon"
                />
              </AccountIcon>
            </Dropdown>
          </div>
        </Header>
        <Layout>
          <Sider
            width={230}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            trigger={null}
            style={{
              background: "#76b4e6",

              height: "100vh",
            }}
          >
            <div
              style={{
                padding: "12px",
                display: "flex",
              }}
            >
              <div
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  background: "#1677ff",
                  padding: 10,
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                <MenuOutlined style={{ color: "white", fontSize: 20 }} />
              </div>
            </div>
            <Menu
              style={{ backgroundColor: "#76b4e6" }}
              mode="vertical"
              inlineCollapsed={collapsed}
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
            <Content>
              <Card>{children}</Card>
            </Content>
          </Layout>
        </Layout>
      </Layout>

      <Modal
        open={isOpen}
        okText={"Yes"}
        cancelText={"Cancel"}
        onCancel={() => setIsOpen(false)}
        onOk={() => handleLogout()}
        title={
          <>
            <h1 className="text-center font-bolf">Logout</h1>
          </>
        }
        centered={true}
      >
        <div className="text-center">
          <h1>Are you sure, want to logout?</h1>
        </div>
      </Modal>
    </>
  );
};

export default AppLayout;
interface IconProps {
  isTriggered?: boolean;
}

const AccountIcon = styled.div<IconProps>`
  height: 34px;
  width: 34px;
  cursor: pointer;
  border: 1px solid;
  border-color: ${({ isTriggered }) => (isTriggered ? "white" : "#76b4e6")};
  border-radius: 50%;
  padding: 3px;
  display: flex;
  margin-top: 10px;
  align-items: center;
  justify-content: center;
  transition: 0.3s all ease;
  &:hover {
    border-color: white;
  }
`;
