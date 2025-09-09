"use client";

import React from "react";
import CardCategory from "./CardCategory";
import { Card } from "antd";
import { styled } from "styled-components";
import { ListCardWrapper } from "..";
import { CategoryProps } from "@/types/category.types";

interface PropTypes {
  dataCategories?: CategoryProps[];
}

const ListCategory = (prop: PropTypes) => {
  return (
    <div className="overflow-x-scroll scrollbar-hide">
      <ListCardWrapper>
        {prop.dataCategories?.slice(0, 5).map((item, index) => (
          <CardCategory
            key={item?.categoryId}
            index={index}
            categoryId={item?.categoryId}
            name={item?.name}
            createdAt={item?.createdAt}
            updatedAt={item?.updatedAt}
            categoryImage={item?.categoryImage}
          />
        ))}
      </ListCardWrapper>
    </div>
  );
};

export default ListCategory;
