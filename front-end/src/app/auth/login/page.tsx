"use client";

import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("@/components/Auth"), {
  ssr: false,
});

export default function LoginClient() {
  return <LoginForm />;
}
