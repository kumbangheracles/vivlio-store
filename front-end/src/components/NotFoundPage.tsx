"use client";
import { useAuth } from "@/hooks/useAuth";
import { Result, Button } from "antd";
import { useRouter } from "next/navigation";

const NotFoundPage = () => {
  const navigate = useRouter();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={() => navigate.push("/")}>
          Back Home
        </Button>
      }
    />
  );
};

export default NotFoundPage;
