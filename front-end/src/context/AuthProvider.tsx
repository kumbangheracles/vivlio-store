"use client";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { ReactNode } from "react";
import { ConfigProvider } from "antd";
import AntdRegistry from "@/libs/AntdRegistry";
interface AuthProviderProps {
  children: ReactNode;
  session?: Session | null;
}

export default function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <ConfigProvider>
      <AntdRegistry>
        <SessionProvider session={session}>{children}</SessionProvider>
      </AntdRegistry>
    </ConfigProvider>
  );
}
