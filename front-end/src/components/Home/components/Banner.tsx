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
      src: "/banner/banner6.jpeg",
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
    <div className="w-full bg-gray-50 py-6">
      <div className="mx-auto max-w-7xl h-[380px] flex gap-4 px-4">
        {/* MAIN BANNER */}
        <div
          className="relative w-[65%] h-full rounded-2xl overflow-hidden shadow-lg group"
          onMouseEnter={() => setIsHoverBanner(true)}
          onMouseLeave={() => setIsHoverBanner(false)}
        >
          {/* Slider */}
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${indexBanner * 100}%)` }}
          >
            {dataBanners1.map((item, i) => (
              <div key={i} className="w-full h-full flex-shrink-0 relative">
                <Image
                  src={item.src}
                  alt="banner"
                  fill
                  className="object-cover"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

                {/* Text + CTA */}
                <div className="absolute bottom-6 z-50 left-6 text-white max-w-[70%]">
                  <h2 className="text-3xl font-bold leading-tight">
                    Find Your Favorite Book
                  </h2>
                  <p className="text-sm opacity-90 mt-1">
                    Thousands of selected book collections for you
                  </p>
                  {/* <button className="mt-4 cursor-pointer px-5 py-2 hover:bg-sky-200 bg-white text-gray-900 rounded-lg text-sm font-medium hover:scale-105 transition">
                    Explore Now
                  </button> */}
                </div>
              </div>
            ))}
          </div>

          {/* Arrows */}
          <div
            className={`absolute inset-0 flex justify-between items-center px-4 transition ${
              isHoverBanner ? "opacity-100" : "opacity-0"
            }`}
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

        {/* SIDE BANNERS */}
        <div className="w-[35%] h-full flex flex-col gap-4 noselect">
          <div className="flex-1 rounded-2xl h-[50%] overflow-hidden bg-gradient-to-br from-blue-200 to-blue-100 shadow relative">
            <div className="w-full h-full overflow-hidden">
              <Image
                alt="banner"
                className="w-full h-full object-cover"
                width={1000}
                height={70}
                src={"/banner/banner9.png"}
              />
            </div>
          </div>

          <div className="flex-1 rounded-2xl h-[50%] overflow-hidden bg-gradient-to-br from-blue-200 to-blue-100 shadow relative">
            <div className="w-full h-full overflow-hidden">
              <Image
                alt="banner"
                className="w-full h-full object-cover"
                width={1000}
                height={70}
                src={"/banner/banner10.png"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
