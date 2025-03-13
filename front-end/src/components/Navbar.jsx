import React from "react";
// import Link from "react-router-dom";
export default function Navbar() {
  return (
    <nav>
      <div className="top-navbar p-4 flex justify-around items-center">
        <span className="logo tracking-widest font-extrabold ">
          <h4>VIVLIO</h4>
        </span>

        <div
          style={{ width: "387px" }}
          className="navbar-option flex justify-around"
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
          className="flex gap-x-35 justify-center p-1 font-medium tracking-widest"
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
