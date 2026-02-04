"use client";
import useGlobalLoadingBar from "@/hooks/useGlobalLoadingBar";
import { Result, Button } from "antd";

const NotFoundPage = () => {
  const { handlePushRoute } = useGlobalLoadingBar();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={() => handlePushRoute("/")}>
          Back Home
        </Button>
      }
    />
  );
};

export default NotFoundPage;
