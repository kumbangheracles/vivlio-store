import AuthProvider from "@/components/AuthProvider";
import { ReactNode } from "react";
import "./globals.css";
import AppLayout from "@/components/Layout";
interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
