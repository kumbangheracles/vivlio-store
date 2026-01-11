"use client";

import { CategoryProps } from "@/types/category.types";
import { Card } from "antd";
import Image from "next/image";
import { styled } from "styled-components";
import DefaultImage from "../../../assets/images/default-img.png";
type PropTypes = CategoryProps & {
  index?: number;
};

const CardCategory = (prop: PropTypes) => {
  return (
    <div
      key={prop.index}
      className="relative w-[340px] border-gray-300 border-2 h-[180px] rounded-xl overflow-hidden shadow-lg cursor-pointer group"
    >
      {/* Background Image */}
      <Image
        src={prop.categoryImage?.imageUrl || DefaultImage}
        width={100}
        height={100}
        alt={"Test"}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-end p-4">
        <h3 className="text-white text-lg font-semibold">{prop.name}</h3>
      </div>
    </div>
  );
};

export default CardCategory;

const TitleCategory = styled.h1`
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  letter-spacing: 1px;
`;

const StyledImage = styled(Image)`
  transition: transform 0.3s ease-in-out;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;

  /* border: 1px solid gray; */
`;
