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
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
} from "react-icons/tb";
import { TiWarning } from "react-icons/ti";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { ErrorHandler } from "../../helper/handleError";
import myAxios from "../../helper/myAxios";
import { UserProperties } from "../../types/user.type";
import { styled } from "styled-components";
import sidebarItems from "./items";
import { ItemType } from "antd/es/menu/interface";
const { Header, Content, Sider } = Layout;

interface PropTypes {
  children?: ReactNode;
}

const AppLayout = ({ children }: PropTypes) => {
  const [isDesktop, setIsDesktop] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const auth = useAuthUser<UserProperties>();
  // console.log("Auth: ", auth);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();
  const [isHover, setIshover] = useState<boolean>(false);
  // console.log("isAuth: ", isAuthenticated);
  const handleLogout = async () => {
    try {
      await myAxios.post("/auth/logout");
      message.info("Logout Success");

      navigate("/login");
    } catch (error) {
      console.log("Error Logout: ", error);
      ErrorHandler(error);
    } finally {
      signOut();
    }
  };

  const getMatchingSidebarKey = (
    pathname: string,
    sidebarItems: ItemType[] = [],
  ): string[] => {
    const flatKeys = sidebarItems.flatMap((item) => {
      if (!item || typeof item === "string") return [];

      if ("children" in item && Array.isArray(item.children)) {
        return [
          item.key?.toString() || "",
          ...item.children.map((child) => child?.key?.toString() || ""),
        ];
      }

      return [item.key?.toString() || ""];
    });

    const matched = flatKeys
      .filter((key) => pathname.startsWith(key))
      .sort((a, b) => b.length - a.length);

    return matched.length ? [matched[0]] : [];
  };

  const selectedKeys = useMemo(
    () => getMatchingSidebarKey(location.pathname, sidebarItems),
    [location.pathname],
  );

  const items = isAuthenticated
    ? [
        {
          key: isAuthenticated ? "profile" : "",
          label: isAuthenticated ? "Profile" : "",
          onClick: () => navigate(`/user/${auth?.id}/detail`),
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

  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 760);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  if (!isDesktop) {
    return (
      <div className=" w-screen h-screen flex flex-col sm:text-lg items-center justify-center text-center bg-gray-100">
        <div className="flex flex-col sm:text-lg items-center justify-center rounded-md bg-sky-50 shadow-2xl p-4! mx-1!">
          <h2 className="text-red-500 text-lg  sm:text-xl font-semibold flex gap-2 items-center">
            <span>
              <TiWarning />
            </span>
            <span>This page is desktop only</span>
          </h2>
          <p className="text-gray-600 mt-2! text-sm">
            Please open this CMS on a device with a wider screen.
          </p>
        </div>
      </div>
    );
  }
  return (
    <>
      <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
        <Layout style={{ height: "100%", width: "100%" }}>
          <Header
            style={{
              background: "#d9eafd",
              paddingInline: "30px",
              position: "sticky",
              top: 0,
              zIndex: "50",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={"/icons/icon.png"}
                  alt="main-logo"
                />
              </div>
              <h4 className="text-xl font-bold tracking-wide text-gray-600">
                ViviBook CMS
              </h4>
            </div>

            <div
              onMouseEnter={() => setIshover(true)}
              onMouseLeave={() => setIshover(false)}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <Dropdown
                overlayStyle={{ zIndex: "1000000" }}
                trigger={["click"]}
                menu={{
                  items: items,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",

                    height: 50,
                    gap: 10,
                  }}
                >
                  <AccountIcon isTriggered={isHover}>
                    <img
                      style={{ objectFit: "contain", cursor: "pointer" }}
                      src="/icons/account.svg"
                      alt="account-icon"
                    />
                  </AccountIcon>
                </div>
              </Dropdown>
              <Username>{auth?.username}</Username>
            </div>
          </Header>
          <Layout style={{ height: "100%" }}>
            <Sider
              width={230}
              collapsible
              collapsed={collapsed}
              collapsedWidth={70}
              onCollapse={(value) => setCollapsed(value)}
              trigger={null}
              style={{
                background: "#d9eafd",

                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                fontWeight: 600,
              }}
            >
              <Menu
                style={{ backgroundColor: "#d9eafd" }}
                mode="vertical"
                selectedKeys={selectedKeys}
                items={sidebarItems}
                onClick={({ key }) => {
                  if (key === "/logout") {
                  } else {
                    navigate(key);
                  }
                }}
              />

              <div
                style={{
                  padding: "12px",
                  display: "flex",
                  position: "absolute",
                  bottom: "0",

                  right: 0,
                }}
              >
                <div
                  onClick={() => setCollapsed((prev) => !prev)}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  <>
                    {collapsed ? (
                      <>
                        <TbLayoutSidebarRightCollapse
                          style={{ color: "white", fontSize: 35 }}
                        />
                      </>
                    ) : (
                      <>
                        <TbLayoutSidebarLeftCollapse
                          style={{ color: "white", fontSize: 35 }}
                        />
                      </>
                    )}
                  </>
                </div>
              </div>
            </Sider>
            <Layout style={{ padding: "24px" }}>
              <Content
                style={{ overflow: "auto", height: "calc(100vh - 64px)" }}
              >
                <Card>{children}</Card>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>

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
  background-color: white;
  border-color: ${({ isTriggered }) => (isTriggered ? "white" : "#76b4e6")};
  border-radius: 50%;
  padding: 5px;
  display: flex;
  margin-top: 10px;
  align-items: center;
  justify-content: center;
  transition: 0.3s all ease;
  &:hover {
    border-color: white;
  }
`;

const Username = styled.h1`
  padding: 10px;

  background-color: white;
  color: #76b4e6;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  height: 30px;
  margin: auto;
  letter-spacing: 1px;
`;

const Logo = styled.h1`
  font-size: 16px;
  background-color: white;
  color: #76b4e6;
  border-radius: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  padding: 20px;
  height: 50px;
  margin-block: auto;
  letter-spacing: 1px;
`;
