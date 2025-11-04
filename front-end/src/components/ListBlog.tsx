"use client";
import useDeviceType from "@/hooks/useDeviceType";
import BlogCard from "./BlogCard";
import { Settings } from "react-slick";
import Slider from "react-slick";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  direction?: string;
}

const Arrow = ({ className, style, onClick, direction }: ArrowProps) => {
  return (
    <span
      className={`
   absolute top-1/2 -translate-y-1/2 z-10 !flex !items-center !justify-center
        w-10 h-10 rounded-full bg-white shadow-md cursor-pointer hover:bg-gray-100
        ${direction === "left" ? "left-2" : "right-2"}
      `}
      style={{ ...style }}
      onClick={onClick}
    >
      {direction === "left" ? <LeftOutlined /> : <RightOutlined />}
    </span>
  );
};

const ListBlog = () => {
  const isMobile = useDeviceType();
  const settings: Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : 3,
    arrows: true,
    slidesToScroll: isMobile ? 1 : 2,
    centerMode: true,
    prevArrow: <Arrow direction="left" />,
    nextArrow: <Arrow direction="right" />,
    className: "!w-full p-4 mt-2 !flex",
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2.5, slidesToScroll: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1.2, slidesToScroll: 1 },
      },
    ],
  };
  return (
    <>
      <div className="py-4 w-full mt-4">
        <h4 className="font-bold tracking-wider text-xl !ml-10">Blog</h4>
        <div className=" overflow-x-hidden relative">
          <Slider {...settings}>
            {/* <div className="p-4 mt-2 !flex !flex-row gap-4 justify-center w-[1500px]"> */}
            <BlogCard />
            <BlogCard />
            <BlogCard />
            <BlogCard />
            <BlogCard />
            <BlogCard />
            <BlogCard />
            <BlogCard />
            <BlogCard />
            {/* </div> */}
          </Slider>
        </div>
      </div>
    </>
  );
};

export default ListBlog;
