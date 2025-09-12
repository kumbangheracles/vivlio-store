"use client";
import React, { useEffect, useState } from "react";
import Dropdown from "antd/es/dropdown/dropdown";
import { message } from "antd";
import { styled } from "styled-components";
import { Modal } from "antd";
import { useRouter } from "next/navigation";
import myAxios from "@/libs/myAxios";
import NextAuth from "next-auth";
import { ErrorHandler } from "@/helpers/handleError";
import AppInput from "./AppInput";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "next-auth/react";
import { SearchOutlined } from "@ant-design/icons";
import DropdownProfile from "./DropdownProfile";
import { UserProperties } from "@/types/user.type";
import { MdOutlineNavigateNext } from "react-icons/md";
interface PropTypes {
  dataUser?: UserProperties;
}

export default function Navbar({ dataUser }: PropTypes) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const auth = useAuth();
  const router = useRouter();

  const [isHover, setIshover] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const handleLogout = async () => {
    try {
      setIsloading(true);
      await myAxios.post("/auth/logout");
      message.info("Logout Success");
      await signOut({
        callbackUrl: "/auth/login",
        // redirect: true,
      });
      // router.push("/auth/login");
    } catch (error) {
      console.log("Error Logout: ", error);
      ErrorHandler(error);
      await signOut({
        callbackUrl: "/auth/login",
        // redirect: true,
      });
    } finally {
      setIsloading(false);
    }
  };

  // useEffect(() => {
  //   // kalau auth masih undefined (belum selesai check), jangan redirect dulu
  //   if (auth?.authenticated === false) {
  //     router.push("/auth/login");
  //   }
  // }, [auth?.authenticated, router]);
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
    <nav className="fixed top-0 w-full h-[auto] bg-[white] z-[999]">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginInline: "100px",
          paddingBlock: 5,
        }}
      >
        <span className="font-extrabold tracking-widest logo ">
          <h4>VIVLIO</h4>
        </span>

        <div
          style={{ width: "357px" }}
          className="flex justify-around navbar-option items-center "
        >
          <div className="input-search-navbar  ">
            <AppInput
              icon={<SearchOutlined />}
              style={{ width: "200px", height: "30px" }}
            />
          </div>
          <div
            onMouseEnter={() => setIshover(true)}
            onMouseLeave={() => setIshover(false)}
          >
            <Dropdown
              trigger={["click"]}
              menu={{
                items: items,
              }}
            >
              <AccountIcon isTriggered={isHover} isAuth={auth?.authenticated}>
                <div className="w-full h-full overflow-hidden rounded-full flex items-center justify-center">
                  <img
                    style={{ objectFit: "cover", cursor: "pointer" }}
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
          <img
            style={{ width: "24px" }}
            src="/icons/chart.svg"
            alt="chart-icon"
          />
        </div>
      </div>

      <div className="bottom-navbar">
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
      <Modal
        open={isOpen}
        okText={"Yes"}
        cancelText={"Cancel"}
        onCancel={() => setIsOpen(false)}
        // loading={isLoading}
        onOk={() => handleLogout()}
        confirmLoading={isLoading}
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
    </nav>
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

const StyledLink = styled(Link)`
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
