// "use client";

import { ReactNode } from "react";
import "./globals.css";
import fetchUser from "./actions/fetchUser";
import AppLayout from "@/components/Layout";
import AuthProvider from "@/context/AuthProvider";

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  // useEffect(() => {
  //   AOS.init();
  // }, []);
  const dataUser = await fetchUser();

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppLayout dataUser={dataUser} isAuthPageTampil={false}>
            {children}
          </AppLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
