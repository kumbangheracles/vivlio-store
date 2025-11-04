"use client";
import Image from "next/image";
import DefaultImg from "../assets/images/default-img.png";
import TestImg from "../assets/images/test-blog.png";
const BlogCard = () => {
  return (
    <div className="rounded-md border border-[#cacaca] w-[350px] h-[300px] relative overflow-hidden cursor-pointer transition-all hover:shadow-xl">
      <span className="absolute text-sm tracking-wide p-2 top-0 right-0 bg-white rounded-bl-2xl w-auto">
        02/01/2005
      </span>
      <div className="flex justify-center items-center w-full h-[150px]">
        <Image
          src={TestImg}
          alt="blog-img"
          width={100}
          height={100}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col gap-4 justify-center items-center absolute bottom-4">
        <h4 className="font-semibold text-[16px] tracking-wider">
          Kumpulan Budak Setan: Kini Cetak Ulang dengan Cover Baru!
        </h4>

        <span className="text-sm text-gray-500">
          Kira-kira horor tuh bisa diartikan sebagai apa lagi ya, Grameds? Yuk,
          simak selengkapnya di sini!
        </span>
      </div>
    </div>
  );
};

export default BlogCard;
