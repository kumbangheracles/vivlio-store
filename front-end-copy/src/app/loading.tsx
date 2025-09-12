import GlobalLoading from "@/components/GlobalLoading";
import { Modal, Spin } from "antd";

export default function Loading() {
  return (
    <>
      {/* <GlobalLoading /> */}
      {/* <Spin size="large" /> */}
      <div className="w-screen h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    </>
  );
}
