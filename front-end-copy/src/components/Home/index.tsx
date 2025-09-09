"use client";
import React from "react";
import Layout from "../../components/Layout";
import Banner from "./components/Banner";
import ListBook from "./components/ListBook";
import { styled } from "styled-components";
import ListCategory from "./components/ListCategory";
import { BookProps } from "@/types/books.type";
import { CategoryProps } from "@/types/category.types";

interface PropTypes {
  titleSection?: string;
  dataBooks?: BookProps[];
  dataCategories?: CategoryProps[];
  fetchBooks?: any;
}

export default function HomePage(prop: PropTypes) {
  // const { titleSection } = prop;
  return (
    <>
      <div>
        <Banner />
      </div>

      <div className="mt-7">
        <TitleList>Popular Category</TitleList>
        <ListCategory dataCategories={prop.dataCategories} />
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
  width: 100%;
  margin: auto;
  justify-content: center;

  gap: 20px;
`;

export const TitleList = styled.h4`
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 2px;
  text-align: start;
  margin-bottom: 10px;
  margin-left: 50px;
`;
