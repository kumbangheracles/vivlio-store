"use client";
import { BookProps } from "@/types/books.type";
import { styled } from "styled-components";
import { useSearchParams } from "next/navigation";
import ListBook from "../Home/components/ListBook";

interface PropTypes {
  dataBooks?: BookProps[];
  key: string;
  total?: number;
  shown?: number;
}

const SearchBookIndex = ({ dataBooks, shown, total }: PropTypes) => {
  const params = useSearchParams();
  const key = params.get("key");
  return (
    <div className="w-full p-4 mt-[-20px]">
      <ListBook
        isCategory
        dataBooks={dataBooks}
        titleSection={`Showing ${shown} of ${total} search results for "${key}"`}
      />
    </div>
  );
};

export default SearchBookIndex;
export const TitleList = styled.h4`
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 2px;
  text-align: start;
  margin-bottom: 10px;
  margin-left: 50px;
`;

const ListBookWrapper = styled.div`
  padding: 5px;
  margin: 0rem 2rem;
`;
