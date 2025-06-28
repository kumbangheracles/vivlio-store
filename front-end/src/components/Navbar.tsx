import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppInput from "./Form/AppInput";
import Dropdown from "antd/es/dropdown/dropdown";
import myAxios from "../helper/myAxios";
import { message } from "antd";
import { ErrorHandler } from "../helper/handleError";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { styled } from "styled-components";
import { Modal } from "antd";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const signOut = useSignOut();

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

  return (
    <nav className="fixed top-0 w-screen h-[auto] bg-white">
      <div className="flex items-center justify-around p-2 top-navbar">
        <span className="font-extrabold tracking-widest logo ">
          <h4>VIVLIO</h4>
        </span>

        <div
          style={{ width: "387px" }}
          className="flex justify-around navbar-option"
        >
          <div className="input-search-navbar ">
            <AppInput />
          </div>
          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                {
                  key: "logout",
                  label: "Logout",
                  onClick: () => setIsOpen(true),
                },
                // {
                //   key: "edit",
                //   label: "Edit",
                //   // onClick: () => handleEdit(record.articleId),
                // },
                // {
                //   key: "delete",
                //   label: "Delete",
                //   danger: true,
                //   // onClick: () => openDeleteModal(record.articleId),
                // },
              ],
            }}
          >
            <img
              style={{ width: "24px", cursor: "pointer" }}
              src="/icons/account.svg"
              alt="account-icon"
            />
          </Dropdown>
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
            <StyledLink to="/">HOME</StyledLink>
          </li>
          <li>
            <StyledLink to="">BLOG</StyledLink>
          </li>
          <li>
            <StyledLink to="">SHOP</StyledLink>
          </li>
          <li>
            <StyledLink to="">ABOUT US</StyledLink>
          </li>
          <li>
            <StyledLink to="">CONTACT US</StyledLink>
          </li>
        </BottomNavbar>
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
  gap: 130px;
  background-color: #d9eafd;
  font-weight: 700;
  text-decoration: none;
  font-family: "Poppins", sans-serif;

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
