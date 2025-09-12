"use client";
import { Card, Row, Col } from "antd";
import Image from "next/image";
import styled from "styled-components";
import DefaultImg from "../../assets/images/default-img.png";
import { UserProperties } from "@/types/user.type";
import { useUserStore } from "@/zustand/user.store";
import { useEffect } from "react";
interface PropTypes {
  dataUser?: UserProperties;
}

const DropdownProfile = ({ dataUser }: PropTypes) => {
  // const { user } = useUserStore();
  // console.log("Data user: ", user);
  // console.log("Error user: ", error);
  // console.log("User: ", user);
  return (
    <CardProfile>
      <div className="w-[70px] h-[70px] rounded-full overflow-hidden flex justify-center items-center border-2 border-gray-500 ">
        <StyledImg
          src={dataUser?.profileImage?.imageUrl || DefaultImg}
          width={100}
          height={100}
          alt={`img-${dataUser?.username}`}
        />{" "}
      </div>

      <div className="ml-[20px]">
        <h4>{dataUser?.fullName || "No content"}</h4>
        <p>{dataUser?.email || "No content"}</p>
      </div>
    </CardProfile>
  );
};

const CardProfile = styled(Card)`
  cursor: default;

  border: none;
  .ant-card-body {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  h4 {
    font-weight: 600;
  }
  p {
    color: #9a9595;
  }
  border-radius: 0;

  border-bottom: 1px solid black;
`;

export default DropdownProfile;

const StyledImg = styled(Image)`
  width: 100%;
  height: 100%;
  display: flex;
  object-fit: contain;
  justify-content: center;
  align-items: center;
`;
