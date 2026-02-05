"use client";

import { CategoryProps } from "@/types/category.types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DefaultImage from "../../../assets/images/default-img.png";
import useGlobalLoadingBar from "@/hooks/useGlobalLoadingBar";
type PropTypes = CategoryProps & {
  index?: number;
};

const CardCategory = (prop: PropTypes) => {
  const router = useRouter();
  const { handlePushRoute } = useGlobalLoadingBar();
  const slugify = (text: string) => {
    return text
      .toLowerCase() // huruf kecil
      .trim() // hapus spasi depan/belakang
      .replace(/[^a-z0-9\s-]/g, "") // hapus karakter aneh
      .replace(/\s+/g, "-") // spasi → -
      .replace(/-+/g, "-"); // -- → -
  };

  const goToCategory = (categoryName: string, categoryId: string) => {
    const slug = slugify(categoryName);
    handlePushRoute(`/category/${slug}/${categoryId}`);
  };
  return (
    <div
      key={prop.index}
      onClick={() => goToCategory(prop.name, prop.categoryId)}
      className="relative w-full sm:w-[200px] border-gray-300 border-2 h-[100px] sm:h-[140px] rounded-xl overflow-hidden shadow-lg cursor-pointer group"
    >
      {/* Background Image */}
      <Image
        src={prop.categoryImage?.imageUrl || DefaultImage}
        width={1000}
        height={1000}
        alt={"Test"}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-end p-4">
        <h3 className="text-white text-sm sm:text-lg font-semibold">
          {prop.name}
        </h3>
      </div>
    </div>
  );
};

export default CardCategory;
