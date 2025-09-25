"use client";

import { Result, Row } from "antd";
import AppButton from "./AppButton";

interface PropTypes {
  result?: "success" | "failed" | "error";
}

const CustomResult = ({ result }: PropTypes) => {
  switch (result) {
    case "success":
      return (
        <Result
          status={"success"}
          title={"Payment Successfull."}
          children={
            <>
              <div className="flex items-center gap-5">
                <AppButton label="See the order" customColor="primary" />
                <AppButton label="Buy Again" />
              </div>
            </>
          }
        />
      );
      break;
    case "failed":
      return (
        <Result status={"warning"} title={"Payment Failed please try again."} />
      );
      break;
    case "error":
      return (
        <Result
          status={"error"}
          title={"Error payment please try again later."}
        />
      );
      break;

    default:
  }
};

export default CustomResult;
