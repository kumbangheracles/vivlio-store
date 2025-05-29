import React from "react";
import CardBook from "./CardBook";
import styled from "styled-components";

const ListBook: React.FC = () => {
  return (
    // Book Overview
    <>
      <div style={{ marginTop: "50px" }}>
        <TitleList>Book Overview</TitleList>
        <ListBookWrapper className="grid gap-[10px] p-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-3">
          {[...Array(8)].map((_, i) => (
            <CardBook key={i} index={i} />
          ))}
        </ListBookWrapper>
      </div>
    </>
  );
};

export default ListBook;

const TitleList = styled.h4`
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 2px;
  text-align: center;
  margin-bottom: 10px;
`;

const ListBookWrapper = styled.div`
  padding: 1rem;
`;
