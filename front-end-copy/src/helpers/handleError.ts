import { message } from "antd";

export const ErrorHandler = (
  error: any,
  backendMsg: string = error?.response?.data?.message || "Something went wrong"
) => {
  message.error(backendMsg);
  console.log("Error from backend:", error);
};
