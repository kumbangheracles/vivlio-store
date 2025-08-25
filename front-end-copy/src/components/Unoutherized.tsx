"use client";
import { useAuth } from "@/hooks/useAuth";
import { Result, Button } from "antd";
import { useRouter } from "next/navigation";

const Unauthorized = () => {
  const navigate = useRouter();
  const auth = useAuth();

  const route = auth?.accessToken
    ? "/"
    : `/auth/login?callbackUrl=${encodeURIComponent("/auth/login")}`;

  return (
    <Result
      status={auth?.accessToken ? "404" : "403"}
      title={auth?.accessToken ? "404" : "403"}
      subTitle={
        auth?.accessToken
          ? "Sorry, the page you visited does not exist."
          : "Sorry, you are not authorized to access this page."
      }
      extra={
        <Button type="primary" onClick={() => navigate.push(route)}>
          {auth?.accessToken ? "Back to home" : "Sign in"}
        </Button>
      }
    />
  );
};

export default Unauthorized;
