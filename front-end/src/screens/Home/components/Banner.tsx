import React from "react";
import bannerImage from "../../../assets/banner.jpg";
import styled from "styled-components";
const Banner = () => {
  return (
    <>
      <BannerContainer>
        <ImageWrapper>
          <img src={bannerImage} alt="banner-image" />
          <img src={bannerImage} alt="banner-image" />
        </ImageWrapper>
        <TitleBanner className="text-shadow-md">Welcome to vivlio</TitleBanner>
      </BannerContainer>
    </>
  );
};

const BannerContainer = styled.div`
  width: 100%;

  position: relative;
  z-index: -20;
`;

const ImageWrapper = styled.div`
  display: flex;
  width: 100%;

  overflow: hidden;

  filter: contrast(0.5);
`;

const TitleBanner = styled.h1`
  font-weight: 700;
  color: #508acd;
  font-size: 62px;
  top: 30%;
  left: 26%;
  padding: 3rem;
  background-color: #ffffff;
  position: absolute;
  border-radius: 12px;
  text-shadow: 1px 4px 0px rgba(0, 0, 0, 0.12);
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.5);
`;
export default Banner;
