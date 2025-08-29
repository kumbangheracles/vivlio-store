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

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const auth = useAuth();
  const router = useRouter();
  console.log("Auth: ", auth);
  const [isHover, setIshover] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const handleLogout = async () => {
    signOut({
      callbackUrl: "/auth/login", // redirect setelah logout
    });
  };

  const items = auth.authenticated
    ? [
        {
          key: auth.authenticated ? "Account" : "",
          label: auth.authenticated ? "Account" : "",
          onClick: () => router.push("/account"),
        },
        {
          key: auth.authenticated ? "logout" : "login",
          label: auth.authenticated ? "Logout" : "Login",
          onClick: () => {
            auth.authenticated ? setIsOpen(true) : router.push("/auth/login");
          },
        },
      ]
    : [
        {
          key: auth.authenticated ? "logout" : "login",
          label: auth.authenticated ? "Logout" : "Login",
          onClick: () => {
            auth.authenticated ? setIsOpen(true) : router.push("/auth/login");
          },
        },
      ];

  return (
    <nav className="fixed top-0 w-full h-[auto] bg-white z-[999]">
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
              <AccountIcon isTriggered={isHover}>
                <img
                  style={{ objectFit: "contain", cursor: "pointer" }}
                  src="/icons/account.svg"
                  alt="account-icon"
                />
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
        loading={isLoading}
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
}

const AccountIcon = styled.div<IconProps>`
  height: 34px;
  width: 34px;
  cursor: pointer;
  border: 1px solid;
  border-color: ${({ isTriggered }) => (isTriggered ? "black" : "white")};
  border-radius: 50%;
  padding: 3px;
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
