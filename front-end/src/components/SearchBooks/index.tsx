import { BookProps } from "@/types/books.type";
import ListBook from "../Home/components/ListBook";

interface PropTypes {
  dataBooks?: BookProps[];
}

const SearchBookIndex = ({ dataBooks }: PropTypes) => {
  return (
    <div>
      <ListBook dataBooks={dataBooks} />
    </div>
  );
};

export default SearchBookIndex;
