"use client";
import React from "react";
import bannerImage from "../../../assets/banner.jpg";
import styled from "styled-components";
import Image from "next/image";
const Banner = () => {
  return (
    <>
      <BannerContainer>
        <ImageWrapper>
          <Image
            style={{ filter: "contrast(0.5)" }}
            src={bannerImage}
            alt="banner-image"
          />
          <TitleBanner className="text-shadow-md">
            Welcome to vivlio
          </TitleBanner>
          <Image
            style={{ filter: "contrast(0.5)" }}
            src={bannerImage}
            alt="banner-image"
          />
        </ImageWrapper>
      </BannerContainer>
    </>
  );
};

const BannerContainer = styled.div`
  width: 100%;
  z-index: -20;
  position: relative;
`;

const ImageWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  overflow: hidden;
  position: relative;
`;

const TitleBanner = styled.h1`
  font-weight: 700;
  color: #7badff;
  font-size: 42px;
  padding: 3rem;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  width: 600px;
  top: 30%;
  z-index: 5;
  position: absolute;
  border-radius: 12px;
  text-shadow: 1px 4px 0px rgba(0, 0, 0, 0.12);
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.5);
`;
export default Banner;
