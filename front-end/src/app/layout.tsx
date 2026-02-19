// "use client";

import { ReactNode } from "react";
import "./globals.css";
import fetchUser from "./actions/fetchUser";
import AppLayout from "@/components/Layout";
import AuthProvider from "@/context/AuthProvider";
import fetchCategory from "./actions/fetchCategory";
import fetchCartedBooks from "./actions/fetchCartedBooks";
import fetchGenres from "./actions/fetchGenre";
import GlobalLoadingBar from "@/components/GlobalLoadingBar";
import fetchBooksHome from "./actions/fetchBooksHome";

interface RootLayoutProps {
  children: ReactNode;
}
export const revalidate = 60;
export default async function RootLayout({ children }: RootLayoutProps) {
  // useEffect(() => {
  //   AOS.init();
  // }, []);
  const dataUser = await fetchUser();
  const dataCategories = await fetchCategory();
  const dataCartedBooks = await fetchCartedBooks();
  const dataGenres = await fetchGenres();
  const dataBooks = await fetchBooksHome({
    isRecomend: true,
  });

  // console.log("Recomend book: ", dataBooks);

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <GlobalLoadingBar />
          <AppLayout
            dataUser={dataUser}
            dataCategories={dataCategories}
            dataCartedBooks={dataCartedBooks}
            isAuthPageTampil={false}
            dataGenres={dataGenres}
            dataBooks={dataBooks?.results}
          >
            {children}
          </AppLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
