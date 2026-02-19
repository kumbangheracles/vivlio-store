"use client";
import useGlobalLoadingBar from "@/hooks/useGlobalLoadingBar";
import { useMounted } from "@/hooks/useMounted";
import { Result, Button } from "antd";
import GlobalLoading from "./GlobalLoading";

const NotFoundPage = () => {
  const { handlePushRoute } = useGlobalLoadingBar();

  const mounted = useMounted();

  if (!mounted) return <GlobalLoading />;
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
