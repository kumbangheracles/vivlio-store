"use client";

import React from "react";
import { styled } from "styled-components";
import IconLocation from "../assets/icons/icon-location.svg";
import {
  FacebookOutlined,
  InstagramOutlined,
  MailFilled,
  PhoneFilled,
  TikTokOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <ParentContainer>
        <Container>
          {/* Bagian Kiri - Info Kontak */}
          <div className="flex flex-col gap-[10px] w-[300px]">
            <IconWrapper>
              <img src={IconLocation} width={20} height={20} alt="location" />
              <p>Jln raya bayur kali</p>
            </IconWrapper>
            <IconWrapper>
              <PhoneFilled />
              <p>08897231231</p>
            </IconWrapper>
            <IconWrapper>
              <MailFilled />
              <p>jamal@gmail.com</p>
            </IconWrapper>
          </div>

          {/* Bagian Tengah - Navigasi */}
          <Navigation>
            <Link className="link" href={"/"}>
              Home
            </Link>
            <Link className="link" href={"/blog"}>
              Blog
            </Link>
            <Link className="link" href={"/shop"}>
              Shop
            </Link>
            <Link className="link" href={"/about-us"}>
              About Us
            </Link>
            <Link className="link" href={"/contact-us"}>
              Contact Us
            </Link>
          </Navigation>

          {/* Bagian Kanan - Tentang Perusahaan */}
          <AboutSection>
            <h1 className="font-bold">About the company</h1>
            <p className="mt-2.5">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Repellendus cum hic mollitia fugit facere enim velit sunt officia.
              Aliquid labore impedit accusamus, eligendi eveniet repellendus.
              Cum, ex. Ad, reiciendis obcaecati!
            </p>
          </AboutSection>
        </Container>

        <Divider />

        {/* Bottom Bar */}
        <BottomBar>
          <p>© 2025 PT Vivlio Jaya Media</p>
          <div className="social-icons">
            <FacebookOutlined />
            <InstagramOutlined />
            <TikTokOutlined />
          </div>
        </BottomBar>
      </ParentContainer>
    </>
  );
};

export default Footer;

const ParentContainer = styled.div`
  background-color: #d9eafd;
  color: #000000;
  width: 100%;
`;

const Container = styled.div`
  padding: 3rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 200px;
  flex-wrap: wrap; /* penting agar elemen bisa turun di layar kecil */
  letter-spacing: 1px;

  @media (max-width: 1024px) {
    gap: 100px;
    padding: 2rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 30px;
    align-items: center;
    text-align: center;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const Navigation = styled.div`
  font-weight: 600;
  display: flex;
  flex-direction: column;
  text-align: start;
  gap: 10px;
  max-width: 300px;

  .link {
    text-decoration: underline;
    color: black;
    transition: color 0.3s;

    &:hover {
      color: white;
    }
  }

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const AboutSection = styled.div`
  width: 300px;

  @media (max-width: 768px) {
    width: 90%;
    text-align: center;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #c0c0c0;
  margin-top: 20px;
`;

const BottomBar = styled.div`
  background-color: #cacaca;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;

  .social-icons {
    display: flex;
    gap: 10px;
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    text-align: center;

    .social-icons {
      justify-content: center;
    }
  }
`;
