"use client";
import { cn } from "@/libs/cn";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";

const Banner = () => {
  const [indexBanner, setIndexBanner] = useState<number>(0);
  const [isHoverBanner, setIsHoverBanner] = useState<boolean>(false);
  const dataBanners1 = [
    {
      id: 1,
      title: "Banner 1.1",
      backgroundColor: "bg-black",
    },
    {
      id: 2,
      title: "Banner 1.2",
      backgroundColor: "bg-yellow-500",
    },
    {
      id: 3,
      title: "Banner 1.3",
      backgroundColor: "bg-red-500",
    },
    {
      id: 4,
      title: "Banner 1.4",
      backgroundColor: "bg-green-500",
    },
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setIndexBanner((prevIndex) =>
        prevIndex === dataBanners1.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [dataBanners1.length]);
  return (
    <div className="p-4 h-[350px] bg-gray-50 mx-auto justify-center w-full items-center gap-3 flex">
      {/* Left */}
      <div
        onMouseEnter={() => setIsHoverBanner(true)}
        onMouseLeave={() => setIsHoverBanner(false)}
        className={`w-[70%] h-full ${dataBanners1[indexBanner].backgroundColor} rounded-xl flex justify-center items-center text-white transition-all duration-500 relative`}
      >
        <div className="absolute w-full transition-all">
          <div
            className={`"flex justify-between mx-4 items-center transition-all"  ${cn(
              !isHoverBanner ? "hidden" : "flex"
            )}`}
          >
            <button
              onClick={() =>
                setIndexBanner((prevIndex) =>
                  prevIndex === 0 ? dataBanners1.length - 1 : prevIndex - 1
                )
              }
              className="w-[45px] h-[45px] rounded-full flex justify-center items-center bg-white text-gray-600  hover:shadow-xl transition-all cursor-pointer"
            >
              <LeftOutlined />
            </button>
            <button
              onClick={() =>
                setIndexBanner((prevIndex) =>
                  prevIndex === dataBanners1.length - 1 ? 0 : prevIndex + 1
                )
              }
              className="w-[45px] h-[45px] rounded-full flex justify-center items-center bg-white text-gray-600  hover:shadow-xl transition-all cursor-pointer"
            >
              <RightOutlined />
            </button>
          </div>
        </div>
        <span className="text-2xl font-bold">
          {dataBanners1[indexBanner].title}
        </span>
      </div>

      {/* Right */}
      <div className="w-[30%] h-full flex gap-3 flex-col">
        <div className="w-full bg-green-400 rounded-xl p-4 h-full">
          <span className="text-2xl font-bold text-white">Banner 2</span>
        </div>
        <div className="w-full bg-yellow-400 rounded-xl p-4 h-full">
          <span className="text-2xl font-bold text-white">Banner 3</span>
        </div>
      </div>
    </div>
  );
};

export default Banner;
