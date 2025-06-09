import React from "react";
import { Link, useNavigate } from "react-router-dom";
export default function Navbar() {
  const navigate = useNavigate();
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
          <div className="input-search-navbar p-2.5 flex justify-between h-10 w-70 border-1 rounded-2xl">
            <input
              type="text"
              className="outline-0"
              placeholder="Search Items . . . "
              style={{ width: "300px" }}
            />
            <img
              style={{ width: "24px" }}
              src="/icons/search.svg"
              alt="search-icon"
            />
          </div>
          <img
            style={{ width: "24px", cursor: "pointer" }}
            onClick={() => navigate("/register")}
            src="/icons/account.svg"
            alt="account-icon"
          />
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
          className="flex justify-center p-1 font-medium tracking-widest gap-x-35"
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
