import { message } from "antd";

export const ErrorHandler = (error: any) => {
  const backendMsg = error?.response?.data?.message || "Something went wrong";
  message.error(backendMsg);
  console.log("error from backend: ", error);
};
