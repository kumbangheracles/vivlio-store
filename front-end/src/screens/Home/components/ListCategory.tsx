import React from "react";
import CardCategory from "./CardCategory";
import { Card } from "antd";
import { styled } from "styled-components";
import { ListCardWrapper } from "..";
const ListCategory = () => {
  return (
    <div className="overflow-x-scroll scrollbar-hide">
      <ListCardWrapper>
        {[...Array(8)].map((_, i) => (
          <CardCategory key={i} index={i} />
        ))}
      </ListCardWrapper>
    </div>
  );
};

export default ListCategory;
