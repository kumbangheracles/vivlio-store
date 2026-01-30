import { ReactNode } from "react";
import styled from "styled-components";

interface PropTypes {
  value: string | ReactNode;
  label: string;
  className?: string;
}

const DetailItem = ({ label, value, className }: PropTypes) => {
  return (
    <div className={className}>
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

export const Value = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: black;
`;
