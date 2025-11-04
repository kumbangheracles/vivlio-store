"use client";
import useDeviceType from "@/hooks/useDeviceType";
import BlogCard from "./BlogCard";
const ListBlog = () => {
  const isMobile = useDeviceType();

  return (
    <>
      <div className="p-4 w-full">
        <h4 className="font-bold tracking-wider text-xl !ml-10">Blog</h4>
        <div className="p-4 mt-2 flex flex-wrap gap-4 justify-center w-full">
          <BlogCard />
          <BlogCard />
          <BlogCard />
          <BlogCard />
        </div>
      </div>
    </>
  );
};

export default ListBlog;
