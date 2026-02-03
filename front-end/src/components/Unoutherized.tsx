"use client";
import { useAuth } from "@/hooks/useAuth";
import useGlobalLoadingBar from "@/hooks/useGlobalLoadingBar";
import { Result, Button } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

const Unauthorized = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const { handlePushRoute } = useGlobalLoadingBar();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const route =
    auth?.authenticated === true
      ? "/"
      : `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  return (
    <Result
      status={auth?.authenticated === true ? "404" : "403"}
      title={auth?.authenticated === true ? "404" : "403"}
      subTitle={
        auth?.authenticated === true
          ? "Sorry, the page you visited does not exist."
          : "Sorry, you are not authorized to access this page."
      }
      extra={
        <Button type="primary" onClick={() => handlePushRoute(route)}>
          {auth?.authenticated === true ? "Back to home" : "Sign in"}
        </Button>
      }
    />
  );
};

export default Unauthorized;
