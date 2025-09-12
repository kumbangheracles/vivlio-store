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
    <MyCard key={prop?.index}>
      <div className="flex flex-col justify-center text-center items-center gap-3">
        <WrapperImage className="wrapper-img-category">
          {prop?.categoryImage ? (
            <StyledImage
              src={prop?.categoryImage.imageUrl!}
              alt={`category-${prop?.name}`}
              width={100}
              height={100}
            />
          ) : (
            <>
              <StyledImage src={DefaultImage} alt={`category-${prop?.name}`} />
            </>
          )}
        </WrapperImage>

        <TitleCategory>{prop?.name}</TitleCategory>
      </div>
    </MyCard>
  );
};

export default CardCategory;

const TitleCategory = styled.h1`
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  letter-spacing: 1px;
`;

const MyCard = styled(Card)`
  padding: 1rem;
  cursor: pointer;

  border: 1px solid #cecbcb;
  width: 200px;
  height: 200px;
  z-index: -10;
  border-radius: 10px;

  transition: 0.5s;

  &:hover {
    transform: scale(1.05);

    padding: 0;
  }
`;

const WrapperImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100px;
  height: 100px;
  overflow: hidden;
  border: 2px solid #cecbcb;

  border-radius: 50%;

  transition: transform 0.5s ease;
`;

const StyledImage = styled(Image)`
  transition: transform 0.3s ease-in-out;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;

  /* border: 1px solid gray; */
`;
