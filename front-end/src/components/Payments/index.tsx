"use client";
import { useAuth } from "@/hooks/useAuth";
import useGlobalLoadingBar from "@/hooks/useGlobalLoadingBar";
import { Button, message, Result, Spin } from "antd";
import { useSearchParams } from "next/navigation";
import Unauthorized from "../Unoutherized";
import { useMounted } from "@/hooks/useMounted";
import GlobalLoading from "../GlobalLoading";
import AppButton from "../AppButton";
import { useEffect, useState } from "react";
import { MidtransTransactionDetail } from "@/types/order.type";
import myAxios from "@/libs/myAxios";
import { ErrorHandler } from "@/helpers/handleError";
import capitalizeWords from "@/libs/capitalizeEachWord";
import useCountDown from "@/hooks/useCountDown";
import { LoadingOutlined } from "@ant-design/icons";

const PaymentIndex = () => {
  const auth = useAuth();
  if (!auth.accessToken) {
    <Unauthorized />;
  }
  const params = useSearchParams();
  const { handleReplaceRoute } = useGlobalLoadingBar();
  const paramsStatus = params.get("transaction_status");
  const paramsOrderId = params.get("order_id");
  const [loading, setLoading] = useState<boolean>(false);
  const [dataOrder, setDataOrder] = useState<MidtransTransactionDetail | null>(
    null,
  );
  const mounted = useMounted();

  const fetchOneOrder = async (orderId: string, status: string) => {
    if (!orderId) return;
    if (status !== "pending") {
      return;
    }

    try {
      setLoading(true);
      const res = await myAxios.get(`midtrans/detail-order/${orderId}`);

      setDataOrder(res.data?.result);
      console.log("Data order: ", res.data.result);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setLoading(false);
    }
  };
  const secondsLeft = useCountDown(dataOrder?.expiry_time);
  function formatTime(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  useEffect(() => {
    fetchOneOrder(paramsOrderId as string, paramsStatus as string);
  }, []);

  const cancelPayment = async (orderId: string) => {
    if (!orderId) return;
    try {
      setLoading(true);

      await myAxios.post(`/midtrans/cancel-payment`, { orderId });

      message.success("Cancel payment success");

      // setTimeout(() => {
      //   handleReplaceRoute("/account?key=transaction");
      // }, 3000);
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyClick = async (textCopy: string) => {
    try {
      await navigator.clipboard.writeText(textCopy);
      message.success("Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  useEffect(() => {
    if (paramsStatus !== "pending") return;
    const timeOut = setTimeout(() => {
      if (secondsLeft !== null && secondsLeft <= 0) {
        message.warning(
          "Payment time has expired, Payment will be automatically cancelled",
        );
        cancelPayment(paramsOrderId as string);
      }
    }, 3000);

    return () => clearTimeout(timeOut);
  }, [secondsLeft]);

  if (!mounted) return <GlobalLoading />;
  return (
    <div className="flex items-center  p-0 sm:p-8 justify-center">
      <div>
        {paramsStatus === "settlement" && (
          <>
            <Result
              extra={
                <div className="flex items-center justify-center gap-3">
                  <Button onClick={() => handleReplaceRoute("/")}>
                    Back to home
                  </Button>
                  <Button
                    onClick={() =>
                      handleReplaceRoute("/account?key=transaction")
                    }
                  >
                    See Order
                  </Button>
                </div>
              }
              status={"success"}
              title="Payment Success, Thanks for your order!"
              subTitle="You'll recieve update in transaction section"
            />
          </>
        )}
        {paramsStatus === "pending" && (
          <>
            <Result
              extra={
                <div className="w-full">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col justify-center items-center gap-2">
                      <h4 className="text-center text-sm font-semibold text-gray-500">
                        Remaining Payment Time
                      </h4>
                      <div className="p-2 bg-red-400 text-white w-[200px] rounded-xl text-2xl font-semibold">
                        <>
                          {loading ? (
                            <LoadingOutlined />
                          ) : (
                            <>{formatTime(secondsLeft)}</>
                          )}
                        </>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-start flex-col ">
                        <h4 className="font-normal text-gray-500">
                          Payment Type
                        </h4>
                        <h4 className="font-semibold">
                          {capitalizeWords(
                            dataOrder?.payment_type.replace("_", " ") as string,
                          )}
                        </h4>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-start flex-col ">
                        <h4 className="font-normal text-gray-500">
                          VA Numbers
                        </h4>
                        <h4 className="font-semibold">
                          {dataOrder?.va_numbers?.[0]?.va_number}
                        </h4>
                      </div>
                      <p
                        className="underline font-semibold cursor-pointer"
                        onClick={() =>
                          handleCopyClick(
                            dataOrder?.va_numbers?.[0]?.va_number.toString() as string,
                          )
                        }
                      >
                        Copy
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-start flex-col ">
                        <h4 className="font-normal text-gray-500">
                          Grass Amount
                        </h4>
                        <h4 className="font-semibold">
                          Rp
                          {parseInt(
                            dataOrder?.gross_amount as string,
                          ).toLocaleString("id-ID")}
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center flex-wrap sm:flex-nowrap gap-3 mt-4">
                    <AppButton
                      loading={loading}
                      customColor="danger"
                      color="danger"
                      onClick={() => cancelPayment(paramsOrderId as string)}
                      label="Cancel Payment"
                      className="w-full"
                    />
                    <AppButton
                      loading={loading}
                      customColor="primary"
                      onClick={() => handleReplaceRoute("/")}
                      color="primary"
                      label=" Shop Again"
                      className="w-full"
                    />
                    <AppButton
                      loading={loading}
                      className="w-full"
                      onClick={() =>
                        handleReplaceRoute("/account?key=transaction")
                      }
                      color="cyan"
                      label="Check Payment Status"
                    />
                  </div>
                </div>
              }
              status={"info"}
              title="Payment Pending"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentIndex;
