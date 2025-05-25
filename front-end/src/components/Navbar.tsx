import React from "react";
// import Link from "react-router-dom";
export default function Navbar() {
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
            style={{ width: "24px" }}
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
            <a href="">HOME</a>
          </li>
          <li>
            <a href="">BLOG</a>
          </li>
          <li>
            <a href="">SHOP</a>
          </li>
          <li>
            <a href="">ABOUT US</a>
          </li>
          <li>
            <a href="">CONTACT US</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
