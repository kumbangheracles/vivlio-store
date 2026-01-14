"use client";

import React from "react";
import CardCategory from "./CardCategory";

import { ListCardWrapper } from "..";
import { CategoryProps } from "@/types/category.types";

interface PropTypes {
  dataCategories?: CategoryProps[];
  isDisplayAll?: boolean;
}

const ListCategory = ({ dataCategories, isDisplayAll = false }: PropTypes) => {
  return (
    <div className="overflow-x-scroll scrollbar-hide">
      <ListCardWrapper>
        {isDisplayAll ? (
          <>
            {" "}
            {dataCategories?.map((item, index) => (
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
          </>
        ) : (
          <>
            {" "}
            {dataCategories?.slice(0, 5).map((item, index) => (
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
          </>
        )}
      </ListCardWrapper>
    </div>
  );
};

export default ListCategory;
