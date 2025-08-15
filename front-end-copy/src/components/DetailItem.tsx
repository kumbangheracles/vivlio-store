"use client";
import { ReactNode } from "react";
import styled from "styled-components";

interface PropTypes {
  value: string | ReactNode;
  label: string;
}

const DetailItem = ({ label, value }: PropTypes) => {
  return (
    <div>
      <Label>{label}</Label>
      {value ? (
        <Value>{value}</Value>
      ) : (
        <span style={{ color: "gray", fontWeight: 500, fontStyle: "italic" }}>
          No Content
        </span>
      )}
    </div>
  );
};

export default DetailItem;

export const Label = styled.h1`
  font-size: 16px;
  font-weight: 600;

  color: black;
`;

const Value = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: black;
`;
