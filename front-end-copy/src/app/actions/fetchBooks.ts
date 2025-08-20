import myAxios from "@/libs/myAxios";
import { BookProps } from "@/types/books.type";
// import { getStaticProps } from "next/dist/build/templates/pages";

// export async function fetchBooks(): Promise<BookProps[]> {
//   const response = await myAxios.get("/books");
//   const dataBooks = response.data.results;
//   return dataBooks;
// }

// export async function getStaticProps() {
//   const response = await myAxios.get("/books");
//   const books = await response.data.results;

//   return {
//     props: { books },
//     revalidate: 60,
//   };
// }
