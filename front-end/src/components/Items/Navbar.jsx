import React from "react";
// import Link from "react-router-dom";
export default function Navbar() {
  return (
    <nav>
      <div className="top-navbar p-4 px-3 pb-0 flex justify-around items-center ">
        <span className="logo tracking-widest font-extrabold ">
          <h4>VIVLIO</h4>
        </span>

        <div
          className="navbar-option flex justify-around w-full gap-x-3"
        >
          <div className="input-search-navbar p-2.5 flex justify-between h-9 w-45 border-1 rounded-2xl ms-auto">
            <input
              type="text"
              className="outline-0 w-full"
              placeholder="Search Items . . . "
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

      <div className="bottom-navbar pb-1 shadow-md mb-5">
        <ul
          // style={{ backgroundColor: "#D9EAFD" }}
          className="flex justify-center pt-3 tracking-widest gap-x-5 capitalize font-light"
        >
          <li>
            <a href="#">home</a>
          </li>
          <li>
            <a href="#">blog</a>
          </li>
          <li>
            <a href="#">shop</a>
          </li>
          <li>
            <a href="#">about</a>
          </li>
          <li>
            <a href="#">contact</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
