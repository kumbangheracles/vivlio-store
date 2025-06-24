import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppInput from "./Form/AppInput";
import Dropdown from "antd/es/dropdown/dropdown";
import myAxios from "../helper/myAxios";
import { message } from "antd";
import { ErrorHandler } from "../helper/handleError";
import useSignOut from "react-auth-kit/hooks/useSignOut";
export default function Navbar() {
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
                  onClick: () => handleLogout(),
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
        <ul
          style={{ backgroundColor: "#D9EAFD" }}
          className="flex justify-center p-[20px] font-medium tracking-widest gap-x-35"
        >
          <li>
            <Link to="/">HOME</Link>
          </li>
          <li>
            <Link to="">BLOG</Link>
          </li>
          <li>
            <Link to="">SHOP</Link>
          </li>
          <li>
            <Link to="">ABOUT US</Link>
          </li>
          <li>
            <Link to="">CONTACT US</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
