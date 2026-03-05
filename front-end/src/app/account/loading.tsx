import { Spin } from "antd";

export default async function Loading() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Spin size="large" />
    </div>
  );
}
