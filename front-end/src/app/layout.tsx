// "use client";

import { ReactNode } from "react";
import "./globals.css";
import fetchUser from "./actions/fetchUser";
import AppLayout from "@/components/Layout";
import AuthProvider from "@/context/AuthProvider";
import fetchCategory from "./actions/fetchCategory";
import fetchCartedBooks from "./actions/fetchCartedBooks";

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  // useEffect(() => {
  //   AOS.init();
  // }, []);
  const dataUser = await fetchUser();
  const dataCategories = await fetchCategory();
  const dataCartedBooks = await fetchCartedBooks();
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppLayout
            dataUser={dataUser}
            dataCategories={dataCategories}
            dataCartedBooks={dataCartedBooks}
            isAuthPageTampil={false}
          >
            {children}
          </AppLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
