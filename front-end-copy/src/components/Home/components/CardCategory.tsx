"use client";

import { Card, Image } from "antd";
import { styled } from "styled-components";

const CardCategory = ({ index }: { index: number }) => {
  return (
    <MyCard key={index}>
      <div>
        <div>
          <Image
            src="/images/no-image.png"
            style={{ width: "100%", height: "100%", zIndex: "-20" }}
            preview={false}
          />
        </div>

        <TitleCategory>Category</TitleCategory>
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

  border: 1px solid #cecbcb;
  width: 500px;
  z-index: -10;
  border-radius: 10px;
`;
