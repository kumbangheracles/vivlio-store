import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import type { BookProps } from "../../../types/books.type";
import type { BaseMultipleResponse } from "../../../types/base.type";
const dataDummy = [
  {
    title: "My Book",
    desription:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum minima non omnis possimus praesentium inventore, quasi delectus quibusdam optio officiis? Provident in excepturi pariatur aut voluptatibus? Facilis fuga itaque perferendis?",
  },
];
const desc =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum minima non omnis possimus praesentium inventore, quasi delectus quibusdam optio officiis? Provident in excepturi pariatur aut voluptatibus? Facilis fuga itaque perferendis?";
const CardBook: React.FC<BookProps> = ({
  author,
  book_type,
  price,
  title,
  book_cover,
  categoryId,
  id,
}) => {
  return (
    <Card key={id}>
      <BookWrapper>
        <BookImage src={book_cover} alt="logo" />
      </BookWrapper>
      <div>
        <h2 style={{ fontWeight: "700", textAlign: "center" }}>{title}</h2>
        <BaseDescription>
          {" "}
          {(() => {
            const maxLength = 50;
            const rawText = desc.replace(/<\/?(p|em)>/g, "") || "No Content";
            const trimmedText =
              rawText.length > maxLength
                ? rawText.slice(0, maxLength).trim() + " . . . ."
                : rawText;
            return trimmedText;
          })()}
        </BaseDescription>
      </div>
      <ButtonReadMore>Read More</ButtonReadMore>
    </Card>
  );
};

const Card = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.5);
  border-radius: 12px;

  width: 100%;
`;

const BookWrapper = styled.div`
  width: 120px;
  height: 120px;
`;

const BookImage = styled.img`
  width: fit-content;
  height: fit-content;
`;

const BaseDescription = styled.p`
  padding: 10px;
  max-height: 90px;
  overflow-y: hidden;
  font-size: 15px;
`;

const ButtonReadMore = styled.button`
  border-radius: 8px;
  width: 100%;
  padding: 5px;
  background-color: #7badff;
  color: white;
  cursor: pointer;
  transition: 0.5s ease;
  &:hover {
    opacity: 0.5;
  }
`;

export default CardBook;
