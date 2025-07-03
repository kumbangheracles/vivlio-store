import React from "react";
import Layout from "../../components/Layout";
import Banner from "./components/Banner";
import ListBook from "./components/ListBook";
import { styled } from "styled-components";
import ListCategory from "./components/ListCategory";

interface PropTypes {
  titleSection?: string;
}

export default function Home(prop: PropTypes) {
  // const { titleSection } = prop;
  return (
    <>
      <Layout>
        <div>
          <Banner />
        </div>

        <div>
          <TitleList>Popular Category</TitleList>
          <ListCategory />
        </div>
        <ListBook titleSection={"Recently Popular"} />
        <ListBook titleSection={"Best Seller"} />
        <ListBook titleSection={"Latest Popular"} />
      </Layout>
    </>
  );
}

export const ListCardWrapper = styled.div`
  padding: 1rem;
  display: flex;
  width: 2000px;

  gap: 20px;
`;

export const TitleList = styled.h4`
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 2px;
  text-align: center;
  margin-bottom: 10px;
`;
