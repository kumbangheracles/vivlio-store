import React, { useState } from "react";
import logo from "../../../public/vivlio-type.png"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const open = () => {
    if (isOpen === false) setIsOpen(true)
    if (isOpen === true) setIsOpen(false)
  }

  return (
    <nav className={`w-full overflow-hidden transition-all duration-400 ease mb-5 sm:h-max sm:pb-2 sm:shadow-sm ${isOpen ? 'h-[18vh] sm:h-[20vh] shadow-sm ' : 'h-[13vh] sm:h-[14vh] '}`} >
      <div className="top-navbar pt-7 px-3 pb-4 lg:pb-6 flex justify-evenly items-center">
        <div
          className="navbar-option flex justify-evenly items-center w-full "
          >

          <div className="flex items-center gap-2">
            <img
              className="w-9 h-9 md:w-10 md:h-10 xl:w-11 xl:h-11 bg-[#487dba] p-2 rounded-full"
              src="/icons/account.svg"
              alt="account-icon"
            />
            <h1 className="title font-medium text-gray-100 hidden lg:inline">Username</h1>
          </div>

          <p className="text-gray-400 hidden lg:inline">|</p>
          <img src={logo} alt="" className="w-15 hidden sm:inline sm:w-17 md:w-19 lg:w-22 xl:w-24"/>
          <svg onClick={open} className={`transition-all duration-400 ease sm:hidden ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#737373" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m7 10l5 5l5-5"/></svg>

          <div className="flex items-center gap-1">
            <div className="bg-gray-100 p-2.5 flex gap-3 justify-between items-center h-9 md:h-11 xl:h-12 w-[60vw] rounded-lg">
              <img
                className="w-5"
                src="/icons/search.svg"
                alt="search-icon"
              />
              <input
                type="text"
                className="w-full focus:outline-none"
                placeholder="Search Items . . . "
              />
            </div>
              <img
                className="w-5 hidden md:inline bg-[#487dba] p-3 h-11 w-11 xl:h-12 rounded-lg"
                src="/icons/search2.svg"
                alt="search-icon"
              />
          </div>

          <img
            className="w-7 lg:w-8"
            src="/icons/chart.svg"
            alt="chart-icon"
          />
        </div>
      </div>

      <div className="content text-xs md:text-sm xl:text-[15px] lg:pb-1">
        <ul
          className="flex justify-center tracking-widest gap-x-5 sm:gap-x-8 md:gap-x-13 xl:gap-x-21 capitalize font-light"
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
