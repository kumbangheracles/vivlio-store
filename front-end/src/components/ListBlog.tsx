"use client";

import { useRef, useState, useEffect } from "react";
import useDeviceType from "@/hooks/useDeviceType";
import BlogCard from "./BlogCard";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { ArticleProperties } from "@/types/article.type";

interface PropTypes {
  dataArticles: ArticleProperties[];
}

const ListBlog: React.FC<PropTypes> = ({ dataArticles }) => {
  const isMobile = useDeviceType();
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const scrollByAmount = isMobile ? 250 : 700;

  const handleScroll = () => {
    const el = carouselRef.current;
    if (!el) return;

    const atStart = el.scrollLeft <= 0;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;

    setShowLeft(!atStart);
    setShowRight(!atEnd);
  };

  const smoothScroll = (target: number, duration = 400) => {
    const el = carouselRef.current;
    if (!el) return;

    const start = el.scrollLeft;
    const change = target - start;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 0.5 - Math.cos(progress * Math.PI) / 2; // easeInOut

      el.scrollLeft = start + change * ease;

      if (elapsed < duration) {
        requestAnimationFrame(animateScroll);
      } else {
        handleScroll();
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const scrollLeft = () => {
    const el = carouselRef.current;
    if (!el) return;
    smoothScroll(el.scrollLeft - scrollByAmount);
  };

  const scrollRight = () => {
    const el = carouselRef.current;
    if (!el) return;
    smoothScroll(el.scrollLeft + scrollByAmount);
  };

  useEffect(() => {
    handleScroll();
    const el = carouselRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="py-4 w-full mt-4 relative">
      <h4 className="font-bold text-sm tracking-wider sm:text-xl sm:!ml-10 ml-3">
        Blog
      </h4>

      {!isMobile && showLeft && (
        <button
          onClick={scrollLeft}
          className="absolute cursor-pointer w-[30px] h-[30px] text-[10px] sm:text-sm left-2 top-1/2 -translate-y-1/2 sm:w-[50px] sm:h-[50px] bg-white border border-gray-600 rounded-full p-3 flex justify-center items-center shadow hover:bg-gray-200 transition-all z-10"
          aria-label="Scroll left"
        >
          <LeftOutlined />
        </button>
      )}

      {!isMobile && showRight && (
        <button
          onClick={scrollRight}
          className="absolute cursor-pointer w-[30px] h-[30px] text-[10px] sm:text-sm right-2 top-1/2 -translate-y-1/2 sm:w-[50px] sm:h-[50px] bg-white border border-gray-600 rounded-full p-3 flex justify-center items-center shadow hover:bg-gray-200 transition-all z-10"
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
