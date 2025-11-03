"use client";
import React, { useState } from "react";
import Dropdown from "antd/es/dropdown/dropdown";
import { Button, message } from "antd";
import { styled } from "styled-components";
import { Modal } from "antd";
import { usePathname, useRouter } from "next/navigation";
import myAxios from "@/libs/myAxios";
import { ErrorHandler } from "@/helpers/handleError";
import AppInput from "./AppInput";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "next-auth/react";
import { SearchOutlined } from "@ant-design/icons";
import DropdownProfile from "./DropdownProfile";
import { UserProperties } from "@/types/user.type";
import { MdOutlineNavigateNext } from "react-icons/md";
import useDeviceType from "@/hooks/useDeviceType";
interface PropTypes {
  dataUser?: UserProperties;
}

export default function Navbar({ dataUser }: PropTypes) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathName = usePathname();
  const auth = useAuth();
  const router = useRouter();
  const isMobile = useDeviceType();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHover, setIshover] = useState<boolean>(false);
  const [isBlue, setIsBlue] = useState<boolean>(true);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const handleLogout = async () => {
    try {
      setIsloading(true);
      await myAxios.post("/auth/logout");
      message.info("Logout Success");
      await signOut({
        callbackUrl: "/auth/login",
      });
    } catch (error) {
      console.log("Error Logout: ", error);
      ErrorHandler(error);
      await signOut({
        callbackUrl: "/auth/login",
      });
    } finally {
      setIsloading(false);
    }
  };

  console.log("Auth: ", auth);

  const goToCart = () => {
    if (auth.loading) return;
    if (!auth.accessToken) {
      message.info("You must login first!!!");
      router.push("/auth/login");
      return;
    }

    router.push("/cart");
  };

  const isActive = (page: string) => pathName === page;

  const handleAuth = (type?: "login" | "logout") => {
    if (type === "login") {
      router.push("/auth/login");
    } else if (type === "logout") {
      setIsOpen(true);
    }
  };

  const items = auth.authenticated
    ? [
        {
          label: <DropdownProfile dataUser={dataUser} />,
          key: "header",
          disabled: true,
          className: "dropdown-header-nav",
        },
        {
          key: "account",
          label: (
            <StyledLabel>
              <span>Account</span>
              <MdOutlineNavigateNext />
            </StyledLabel>
          ),
          onClick: () => router.push("/account"),
        },
        {
          key: "logout",
          label: (
            <StyledLabel>
              <span>Logout</span>
              <MdOutlineNavigateNext />
            </StyledLabel>
          ),
          onClick: () => {
            setIsOpen(true);
          },
        },
      ]
    : [
        {
          key: "login",
          label: (
            <StyledLabel>
              <span>Login</span>
              <MdOutlineNavigateNext />
            </StyledLabel>
          ),
          onClick: () => {
            router.push("/auth/login");
          },
        },
      ];

  return (
    <>
      <nav className="fixed top-0 w-full bg-white z-[999] shadow-sm transition-all">
        {/* Top Navbar */}
        <div className="flex justify-between items-center px-5 md:px-[100px] py-3">
          {/* Logo */}

          {!isMobile && (
            <span
              className="font-extrabold tracking-widest text-xl logo cursor-pointer"
              onClick={() => router.push("/")}
            >
              VIVLIO
            </span>
          )}

          <div className="input-search-navbar w-full sm:w-[70%] mr-4">
            <AppInput
              prefix={<SearchOutlined />}
              placeholder="Search Books, Blogs, etc"
              style={{
                width: "100%",
                height: "35px",
                borderRadius: 15,
                letterSpacing: 1,
              }}
            />
          </div>
          {/* Desktop Menu */}

          <div className="hidden md:flex justify-around items-center gap-5">
            {/* Search */}

            {/* Account */}
            <div
              onMouseEnter={() => setIshover(true)}
              onMouseLeave={() => setIshover(false)}
            >
              <Dropdown trigger={["click"]} menu={{ items }}>
                <AccountIcon isTriggered={isHover} isAuth={auth?.authenticated}>
                  <div
                    className={` ${
                      auth?.accessToken
                        ? "w-[35px] h-[35px]"
                        : "w-[25px] h-[25px]"
                    }  overflow-hidden rounded-full flex items-center justify-center cursor-pointer`}
                  >
                    <img
                      className="object-cover w-full h-full"
                      src={
                        auth?.authenticated
                          ? dataUser?.profileImage?.imageUrl
                          : "/icons/account.svg"
                      }
                      alt="account-icon"
                    />
                  </div>
                </AccountIcon>
              </Dropdown>
            </div>

            {/* Cart */}
            <div
              className="flex items-center justify-center w-[30px] h-[30px] cursor-pointer border rounded-full p-1 border-white hover:border-black transition-all"
              onClick={() => goToCart()}
            >
              <img
                className="w-full h-full object-cover"
                src="/icons/chart.svg"
                alt="chart-icon"
              />
            </div>
          </div>

          {isMobile && (
            <div
              className="flex items-center justify-center w-[30px] h-[30px] cursor-pointer border rounded-full p-1 border-white hover:border-black transition-all"
              onClick={() => goToCart()}
            >
              <img
                className="w-full h-full object-cover"
                src="/icons/chart.svg"
                alt="chart-icon"
              />
            </div>
          )}
          {/* Mobile Menu Button */}
          {/* <div className="md:hidden flex items-center gap-4">
            <div
              className="flex items-center justify-center w-[30px] h-[30px] cursor-pointer border rounded-full p-1 border-white hover:border-black transition-all"
              onClick={() => goToCart()}
            >
              <img
                className="w-full h-full object-cover"
                src="/icons/chart.svg"
                alt="chart-icon"
              />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-2xl transition-all"
            >
              {isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
            </button>
          </div> */}
        </div>

        {/* Bottom Navbar - Desktop */}
        <div className="hidden md:block border-t">
          <BottomNavbar>
            <li>
              <StyledLink href="/">HOME</StyledLink>
            </li>
            <li>
              <StyledLink href="/blog">BLOG</StyledLink>
            </li>
            <li>
              <StyledLink href="/shop">SHOP</StyledLink>
            </li>
            <li>
              <StyledLink href="/about-us">ABOUT US</StyledLink>
            </li>
            <li>
              <StyledLink href="/contact-us">CONTACT US</StyledLink>
            </li>
          </BottomNavbar>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t flex flex-col items-center py-3 gap-3 transition-all">
            <StyledLink
              onClick={() => setIsMobileMenuOpen(false)}
              isBlue={isActive("/")}
              href="/"
            >
              HOME
            </StyledLink>
            <StyledLink
              onClick={() => setIsMobileMenuOpen(false)}
              isBlue={isActive("/blog")}
              href="/blog"
            >
              BLOG
            </StyledLink>
            <StyledLink
              onClick={() => setIsMobileMenuOpen(false)}
              isBlue={isActive("/shop")}
              href="/shop"
            >
              SHOP
            </StyledLink>
            <StyledLink
              onClick={() => setIsMobileMenuOpen(false)}
              isBlue={isActive("/about-us")}
              href="/about-us"
            >
              ABOUT US
            </StyledLink>
            <StyledLink
              onClick={() => setIsMobileMenuOpen(false)}
              isBlue={isActive("/contact-us")}
              href="/contact-us"
            >
              CONTACT US
            </StyledLink>
            <StyledLink
              onClick={() => setIsMobileMenuOpen(false)}
              isBlue={isActive("/account")}
              href="/account"
            >
              ACCOUNT
            </StyledLink>

            {auth?.accessToken ? (
              <Button onClick={() => handleAuth("logout")}>LOGOUT</Button>
            ) : (
              <Button onClick={() => handleAuth("login")}>LOGIN</Button>
            )}
          </div>
        )}

        {/* Logout Modal */}
        <Modal
          open={isOpen}
          okText="Yes"
          cancelText="Cancel"
          onCancel={() => setIsOpen(false)}
          onOk={handleLogout}
          confirmLoading={isLoading}
          title={<h1 className="text-center font-bold">Logout</h1>}
          centered
        >
          <div className="text-center">
            <h1>Are you sure you want to logout?</h1>
          </div>
        </Modal>
      </nav>
    </>
  );
}

const BottomNavbar = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px;
  font-size: 12px;
  --tw-tracking: var(--tracking-widest);
  letter-spacing: var(--tracking-widest);
  justify-content: space-around;
  background-color: #d9eafd;
  font-weight: 700;
  text-decoration: none;
  font-family: "Poppins", sans-serif;
  width: 100%;
  li {
    text-decoration: none;
    list-style: none;
    position: relative;
  }
`;

interface linkProps {
  isBlue?: boolean;
}

const StyledLink = styled(Link)<linkProps>`
  &:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    height: 2px;
    width: 0;
    background-color: black;
    transition: all 0.3s ease;
  }

  &:hover&:after {
    width: 100%;
  }

  @media (max-width: 768px) {
    background-color: ${({ isBlue }) => (isBlue ? "#d9eafd" : "white")};
    font-size: small;
    width: 100%;
    text-align: center;
    padding: 7px;
    transition: all 0.3s ease;
    &:hover&:after {
      width: 0;
    }

    &:hover {
      background-color: #d9eafd;
    }
  }
`;

interface IconProps {
  isTriggered?: boolean;
  isAuth?: boolean;
}

const AccountIcon = styled.div<IconProps>`
  height: 34px;
  width: 34px;
  cursor: pointer;
  border: 1px solid;
  border-color: ${({ isTriggered }) => (isTriggered ? "black" : "white")};
  border-radius: 50%;
  padding: ${({ isAuth }) => (isAuth ? "0" : "3px")};
  display: flex;
  /* margin-top: 10px; */
  align-items: center;
  justify-content: center;
  transition: 0.3s all ease;
  &:hover {
    border-color: black;
  }

  z-index: 99999999999999999;

  /* @media (max-width: 768px) {
    
  } */
`;

const StyledLabel = styled.h4`
  span {
    padding: 8px;
    font-weight: normal;
    font-size: 16px;
  }

  display: flex;
  justify-content: space-between;
  align-items: center;
`;
