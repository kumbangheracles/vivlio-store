"use client";
import { cn } from "@/libs/cn";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Banner = () => {
  const [indexBanner, setIndexBanner] = useState<number>(0);
  const [isHoverBanner, setIsHoverBanner] = useState<boolean>(false);
  const dataBanners1 = [
    {
      id: 1,
      title: "Banner 1.1",
      src: "/banner/banner1.jpeg",
      backgroundColor: "bg-black",
    },
    {
      id: 2,
      title: "Banner 1.2",
      src: "/banner/banner3.jpeg",
      backgroundColor: "bg-yellow-500",
    },
    {
      id: 3,
      title: "Banner 1.3",
      src: "/banner/banner7.jpeg",
      backgroundColor: "bg-red-500",
    },
    {
      id: 4,
      title: "Banner 1.4",
      src: "/banner/banner8.jpeg",
      backgroundColor: "bg-green-500",
    },
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setIndexBanner((prevIndex) =>
        prevIndex === dataBanners1.length - 1 ? 0 : prevIndex + 1,
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [dataBanners1.length]);
  return (
    <div className="p-4 h-[350px] bg-gray-100 mx-auto justify-center w-full items-center gap-3 flex">
      {/* Left */}
      <div
        onMouseEnter={() => setIsHoverBanner(true)}
        onMouseLeave={() => setIsHoverBanner(false)}
        className={`w-[70%] h-full ${dataBanners1[indexBanner].backgroundColor} rounded-xl flex justify-center items-center text-white transition-all duration-500 relative overflow-hidden border border-gray-400`}
      >
        <div className="absolute w-full transition-all z-50">
          <div
            className={`"flex justify-between mx-4 items-center transition-all"  ${cn(
              !isHoverBanner ? "hidden" : "flex",
            )}`}
          >
            <button
              onClick={() =>
                setIndexBanner((prevIndex) =>
                  prevIndex === 0 ? dataBanners1.length - 1 : prevIndex - 1,
                )
              }
              className="w-[45px] h-[45px] rounded-full flex justify-center items-center bg-white text-gray-600  hover:shadow-xl transition-all cursor-pointer"
            >
              <LeftOutlined />
            </button>
            <button
              onClick={() =>
                setIndexBanner((prevIndex) =>
                  prevIndex === dataBanners1.length - 1 ? 0 : prevIndex + 1,
                )
              }
              className="w-[45px] h-[45px] rounded-full flex justify-center items-center bg-white text-gray-600  hover:shadow-xl transition-all cursor-pointer"
            >
              <RightOutlined />
            </button>
          </div>
        </div>
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${indexBanner * 100}%)`,
          }}
        >
          {dataBanners1.map((item, i) => (
            <div key={i} className="w-full h-full flex-shrink-0">
              <Image
                src={item.src}
                width={1000}
                height={1000}
                alt="banner"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
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
