"use client";
import Image from "next/image";
import TestImage from "../assets/images/test-blog.png";
import useDeviceType from "@/hooks/useDeviceType";
import { ArticleProperties } from "@/types/article.type";
import { truncateText } from "@/helpers/truncateText";
import dayjs from "dayjs";

interface PropTypes {
  dataAricle: ArticleProperties;
}

const BlogCard: React.FC<PropTypes> = ({ dataAricle }) => {
  const isMobile = useDeviceType();

  return (
    <>
      {isMobile ? (
        <div className="relative rounded-md w-[100px] flex-none basis-[10em] overflow-hidden h-[200px] border border-[#cacaca]">
          <span className="absolute text-[7px] sm:text-sm tracking-wide p-2 top-0 right-0 bg-white rounded-bl-2xl w-auto">
            {dayjs(dataAricle?.createdAt).format("YYYY-MM-DD") || "No Content"}
          </span>
          <div className="flex justify-center items-center w-full h-[100px] ">
            <Image
              src={dataAricle?.articleImages?.imageUrl || TestImage}
              alt="blog-img"
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-2 flex flex-col gap-1 justify-center items-start">
            <h4 className="font-semibold text-[10px] sm:text-[16px] tracking-wide">
              {dataAricle?.title || "No Content"}
            </h4>

            <span className="text-[7px] sm:text-sm text-gray-500 tracking-wider">
              {truncateText(dataAricle?.description as string, 100)}
            </span>
          </div>
        </div>
      ) : (
        <div className="blog-card rounded-md border border-[#cacaca] w-[200px] h-[200px]  sm:w-[350px] sm:h-[300px] relative overflow-hidden cursor-pointer transition-all hover:shadow-xl">
          <span className="absolute text-[7px] sm:text-sm tracking-wide p-2 top-0 right-0 bg-white rounded-bl-2xl w-auto">
            {dayjs(dataAricle?.createdAt).format("YYYY-MM-DD") || "No Content"}
          </span>
          <div className="flex justify-center items-center w-full h-[90px] sm:h-[150px]">
            <Image
              src={dataAricle?.articleImages?.imageUrl || TestImage}
              alt="blog-img"
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-4 flex flex-col gap-2 justify-start items-start">
            <h4 className="font-semibold text-[12px] sm:text-[16px] tracking-wider">
              {truncateText(dataAricle?.title as string, 20) || "No Content"}
            </h4>
            <span className="text-[10px] sm:text-sm text-gray-500">
              {truncateText(dataAricle?.description as string, 100) ||
                "No Content"}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogCard;
