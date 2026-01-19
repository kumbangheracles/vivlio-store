"use client";

import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import IconLocation from "../assets/icons/icon-location.svg";
import {
  FacebookOutlined,
  HeartOutlined,
  HomeOutlined,
  InstagramOutlined,
  MailFilled,
  PhoneFilled,
  TikTokOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import CategoryOutlined from "../assets/icons/category-icon.svg";
import useDeviceType from "@/hooks/useDeviceType";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
const Footer = () => {
  const router = useRouter();
  const isMobile = useDeviceType();
  const path = usePathname();
  const [classFoot, setClassFoot] = useState("");

  const handleStyleFoot = (pathName: string) => {
    if (
      pathName === "/" ||
      pathName === "/account" ||
      pathName === "/category" ||
      pathName === "/account/wishlist"
    ) {
      setClassFoot(
        "bg-white rounded-full w-[40px] h-[40px] p-1 flex items-center transition-all justify-center absolute top-[-20px]",
      );
    } else {
      setClassFoot("w-[40px] h-[40px] p-1");
    }
  };

  useEffect(() => {
    handleStyleFoot(path);
  }, [path]);

  return (
    <>
      {isMobile ? (
        <>
          {path !== "/cart" ? (
            <div className="flex base-blue items-center justify-between w-full shadow-[0_-4px_6px_rgba(0,0,0,0.1)] border-gray-400 fixed bottom-0 py-5 px-7 z-50">
              <div className="flex items-center transition-all flex-col relative w-full">
                <HomeOutlined
                  onClick={() => {
                    router.push("/");
                  }}
                  className={path === "/" ? classFoot : "w-[20px]"}
                />
              </div>
              <div
                className="flex items-center transition-all flex-col relative w-full"
                onClick={() => {
                  router.push("/category");
                }}
              >
                <Image
                  src={CategoryOutlined}
                  width={20}
                  height={20}
                  alt="category-icon"
                  className={path === "/category" ? classFoot : "w-[20px]"}
                />
              </div>
              <div className="flex items-center transition-all flex-col relative w-full ">
                <HeartOutlined
                  className={
                    path === "/account/wishlist" ? classFoot : "w-[20px]"
                  }
                  onClick={() => router.push("/account/wishlist")}
                />
              </div>
              <div className="flex items-center transition-all flex-col relative w-full ">
                <UserOutlined
                  className={path === "/account" ? classFoot : "w-[20px]"}
                  onClick={() => router.push("/account")}
                />
              </div>
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        <ParentContainer>
          <Container>
            {/* Bagian Kiri - Info Kontak */}
            <div className="flex flex-col gap-[10px] w-[300px]">
              <IconWrapper>
                <Image
                  src={IconLocation}
                  width={20}
                  height={20}
                  alt="location"
                />
                <p>North of Westaros, Winterfell</p>
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
              <Link className="link" href={"/cart"}>
                Cart
              </Link>
              <Link className="link" href={"/account"}>
                Account Details
              </Link>
              <Link className="link" href={"/"}>
                Browse Book
              </Link>
            </Navigation>

            {/* Bagian Kanan - Tentang Perusahaan */}
            <AboutSection>
              <h1 className="font-bold">About the company</h1>
              <p className="mt-2.5">
                ViviBook is here to be your reading companion. We offer a wide
                selection of books for all ages, believing every page holds a
                story and meaning worth discovering.
              </p>
            </AboutSection>
          </Container>

          <Divider />

          {/* Bottom Bar */}
          <BottomBar>
            <p>© 2025 kumbangheracles</p>
            <div className="social-icons">
              <FacebookOutlined />
              <InstagramOutlined />
              <TikTokOutlined />
            </div>
          </BottomBar>
        </ParentContainer>
      )}
    </>
  );
};

export default Footer;

const ParentContainer = styled.div`
  background-color: #d9eafd;
  color: #000000;

  @media (max-width: 768px) {
    width: 100%;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const Container = styled.div`
  padding: 3rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 200px;
  width: 100%;
  flex-wrap: wrap;
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
