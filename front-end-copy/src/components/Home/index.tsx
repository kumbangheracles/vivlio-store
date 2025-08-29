"use client";
import React from "react";
import Layout from "../../components/Layout";
import Banner from "./components/Banner";
import ListBook from "./components/ListBook";
import { styled } from "styled-components";
import ListCategory from "./components/ListCategory";
import { BookProps } from "@/types/books.type";

interface PropTypes {
  titleSection?: string;
  dataBooks?: BookProps[];
  fetchBooks?: any;
}

export default function HomePage(prop: PropTypes) {
  // const { titleSection } = prop;
  return (
    <>
      <div>
        <Banner />
      </div>

      <div>
        <TitleList>Popular Category</TitleList>
        <ListCategory />
      </div>
      <ListBook
        dataBooks={prop.dataBooks}
        titleSection={"Recently Popular"}
        fetchBooks={prop.fetchBooks}
      />
      <ListBook titleSection={"Best Seller"} />
      <ListBook titleSection={"Latest Popular"} />
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
