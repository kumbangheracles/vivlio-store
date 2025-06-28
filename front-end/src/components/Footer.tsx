import { Col, Divider, Row } from "antd";
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
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <>
      <ParentContainer>
        <Container>
          <div className="flex flex-col gap-[10px] w-[300px]">
            <IconWrapper>
              <img src={IconLocation} width={20} height={20} />
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
          <Navigation>
            <Link className="link" to={"/"}>
              Home
            </Link>
            <Link className="link" to={"/blog"}>
              Blog
            </Link>
            <Link className="link" to={"/shop"}>
              Shop
            </Link>
            <Link className="link" to={"/about-us"}>
              About Us
            </Link>
            <Link className="link" to={"/contact-us"}>
              Contact Us
            </Link>
          </Navigation>
          <div className=" w-[300px]">
            <h1 className="font-bold ">About the company</h1>
            <p className="mt-2.5">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Repellendus cum hic mollitia fugit facere enim velit sunt officia.
              Aliquid labore impedit accusamus, eligendi eveniet repellendus.
              Cum, ex. Ad, reiciendis obcaecati!
            </p>
          </div>
        </Container>
        <hr />
        <div style={{ padding: "10px 20px", backgroundColor: "#303438" }}>
          <div className="flex justify-between p-4 text-[white]">
            <p>© 2025 PT Vivlio Jaya Media</p>
            <div className="text-3xl flex gap-[10px] items-center">
              <FacebookOutlined />
              <InstagramOutlined />
              <TikTokOutlined />
            </div>
          </div>
        </div>
      </ParentContainer>
    </>
  );
};

export default Footer;

const ParentContainer = styled.div`
  background-color: #d9eafd;
`;

const Container = styled.div`
  padding: 3rem;

  color: #000000;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 200px;
  align-items: center;

  letter-spacing: 1px;
`;

const IconWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
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

    &:hover {
      color: white;
    }
  }
`;
