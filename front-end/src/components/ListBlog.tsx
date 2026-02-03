"use client";

import { useRef, useState, useEffect } from "react";
import useDeviceType from "@/hooks/useDeviceType";
import BlogCard from "./BlogCard";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { ArticleProperties } from "@/types/article.type";
import { useRouter } from "next/navigation";
import useGlobalLoadingBar from "@/hooks/useGlobalLoadingBar";

interface PropTypes {
  dataArticles: ArticleProperties[];
}

const ListBlog: React.FC<PropTypes> = ({ dataArticles }) => {
  const isMobile = useDeviceType();
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollByAmount = isMobile ? 250 : 700;
  const router = useRouter();
  const { handlePushRoute } = useGlobalLoadingBar();
  const handleScroll = () => {
    const el = carouselRef.current;
    if (!el) return;

    const atStart = el.scrollLeft <= 1;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;

    setShowLeft(!atStart);
    setShowRight(!atEnd);
  };

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const smoothScroll = (direction: "left" | "right") => {
    const el = carouselRef.current;
    if (!el || isScrolling) return;

    setIsScrolling(true);

    const start = el.scrollLeft;
    const scrollAmount =
      direction === "left" ? -scrollByAmount : scrollByAmount;
    const target = Math.max(
      0,
      Math.min(start + scrollAmount, el.scrollWidth - el.clientWidth),
    );
    const change = target - start;
    const duration = 600;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeInOutCubic(progress);

      el.scrollLeft = start + change * easeProgress;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        setIsScrolling(false);
        handleScroll();
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const scrollLeft = () => smoothScroll("left");
  const scrollRight = () => smoothScroll("right");

  useEffect(() => {
    handleScroll();
    const el = carouselRef.current;
    if (!el) return;

    el.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div className="py-4 w-full mt-4 relative sm:bg-white bg-gray-100 rounded-md">
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-sm tracking-wider sm:text-xl sm:!ml-10 ml-3">
          Blog
        </h4>

        <h4
          onClick={() => handlePushRoute("/articles")}
          className=" text-gray-500 font-normal mr-2 sm:mr-4 sm:text-sm sm:hover:underline tracking-normal text-[11px] cursor-pointer"
        >
          See All
        </h4>
      </div>

      {!isMobile && showLeft && (
        <button
          onClick={scrollLeft}
          disabled={isScrolling}
          className="absolute cursor-pointer w-[30px] h-[30px] text-[10px] sm:text-sm left-2 top-1/2 -translate-y-1/2 sm:w-[50px] sm:h-[50px] bg-white border border-gray-600 rounded-full p-3 flex justify-center items-center shadow hover:bg-gray-200 transition-all z-10 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Scroll left"
        >
          <LeftOutlined />
        </button>
      )}

      {!isMobile && showRight && (
        <button
          onClick={scrollRight}
          disabled={isScrolling}
          className="absolute cursor-pointer w-[30px] h-[30px] text-[10px] sm:text-sm right-2 top-1/2 -translate-y-1/2 sm:w-[50px] sm:h-[50px] bg-white border border-gray-600 rounded-full p-3 flex justify-center items-center shadow hover:bg-gray-200 transition-all z-10 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Scroll right"
        >
          <RightOutlined />
        </button>
      )}

      {isMobile ? (
        <>
          <div className="w-full overflow-x-scroll mobile-cardList">
            <div className="flex items-center gap-5 w-full p-4 mobile-cardList">
              {dataArticles.map((item) => (
                <BlogCard key={item.id} dataAricle={item} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div ref={carouselRef} className="carousel-blog">
          {dataArticles.map((item) => (
            <BlogCard key={item.id} dataAricle={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListBlog;
