"use client";
import Image from "next/image";
import TestImg from "../assets/images/test-blog.png";
import useDeviceType from "@/hooks/useDeviceType";
const BlogCard = () => {
  const isMobile = useDeviceType();

  return (
    <>
      {isMobile ? (
        <div className="relative rounded-md w-[100px] flex-none basis-[10em] overflow-hidden h-[200px] border border-[#cacaca]">
          <span className="absolute text-[7px] sm:text-sm tracking-wide p-2 top-0 right-0 bg-white rounded-bl-2xl w-auto">
            02/01/2005
          </span>
          <div className="flex justify-center items-center w-full h-[100px] ">
            <Image
              src={TestImg}
              alt="blog-img"
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-2 flex flex-col gap-1 justify-center items-center absolute bottom-0">
            <h4 className="font-semibold text-[10px] sm:text-[16px] tracking-wide">
              Kumpulan Budak Setan: Kini Cetak Ulang dengan Cover Baru!
            </h4>

            <span className="text-[7px] sm:text-sm text-gray-500 tracking-wider">
              Kira-kira horor tuh bisa diartikan sebagai apa lagi ya, Grameds?
              Yuk, simak selengkapnya di sini!
            </span>
          </div>
        </div>
      ) : (
        <div className="blog-card rounded-md border border-[#cacaca] w-[200px] h-[200px]  sm:w-[350px] sm:h-[300px] relative overflow-hidden cursor-pointer transition-all hover:shadow-xl">
          <span className="absolute text-[7px] sm:text-sm tracking-wide p-2 top-0 right-0 bg-white rounded-bl-2xl w-auto">
            02/01/2005
          </span>
          <div className="flex justify-center items-center w-full h-[90px] sm:h-[150px]">
            <Image
              src={TestImg}
              alt="blog-img"
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-4 flex flex-col gap-3 justify-center items-center absolute bottom-1">
            <h4 className="font-semibold text-[12px] sm:text-[16px] tracking-wider">
              Kumpulan Budak Setan: Kini Cetak Ulang dengan Cover Baru!
            </h4>

            <span className="text-[10px] sm:text-sm text-gray-500">
              Kira-kira horor tuh bisa diartikan sebagai apa lagi ya, Grameds?
              Yuk, simak selengkapnya di sini!
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogCard;
