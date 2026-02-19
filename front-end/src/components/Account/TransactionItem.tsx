"use client";
import useCountDown from "@/hooks/useCountDown";
import {
  transactionStatusStyle,
  TransactionStatus,
  MidtransTransactionDetail,
} from "@/types/order.type";
import { CopyOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Divider, message, Modal } from "antd";
import dayjs from "dayjs";
import DefaultBook from "../../assets/images/bookDefault.png";
import FadeUpWrapper from "../Home/FadeUpWrapper";
import { TransactionProps } from "@/types/transaction.type";
import Image from "next/image";
import { useEffect, useState } from "react";
import formatTime from "@/helpers/formatTime";
import DetailItem from "../DetailItem";
import { ErrorHandler } from "@/helpers/handleError";
import myAxios from "@/libs/myAxios";
import { useRouter } from "next/navigation";
import capitalizeWords from "@/libs/capitalizeEachWord";
import { truncateText } from "@/helpers/truncateText";
import useDeviceType from "@/hooks/useDeviceType";
interface PropTypes {
  item?: TransactionProps;
  index?: number;
}

const TransactionItem = ({ item, index }: PropTypes) => {
  const secondsLeft = useCountDown(item?.expiry_time);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const isMobile = useDeviceType();
  const [dataOrder, setDataOrder] = useState<MidtransTransactionDetail | null>(
    null,
  );
  const handleCopyClick = async (
    textCopy: string,
    e?: React.MouseEvent<HTMLDivElement | HTMLSpanElement>,
  ) => {
    e?.stopPropagation();

    console.log("Text copy: ", textCopy);
    if (textCopy === null) {
      return;
    }

    try {
      await navigator.clipboard.writeText(textCopy);
      message.success("Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const fetchOneOrder = async (orderId: string, status: string) => {
    if (!orderId) return;
    if (status !== "PENDING") {
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

  // useEffect(() => {
  //   fetchOneOrder(item?.orderGroupId as string, item?.paymentStatus as string);
  // }, [isOpen]);

  useEffect(() => {
    if (secondsLeft === 0) {
      router.refresh();
    }
  }, []);
  const handleOpenDetailOrder = (orderId: string, status: string) => {
    if (!orderId && !status) return;

    setLoading(true);
    fetchOneOrder(orderId, status);
    setTimeout(() => {
      setLoading(false);
      console.log("Data Order: ", dataOrder);
    }, 1500);
    setIsOpen(true);
  };

  return (
    <FadeUpWrapper delay={(index as number) * 100} key={item?.id}>
      {isMobile ? (
        <>
          <div
            onClick={() =>
              handleOpenDetailOrder(
                item?.orderGroupId as string,
                item?.paymentStatus as string,
              )
            }
            className="mt-3 rounded-xl border border-gray-300 mx-2 p-2"
          >
            <div className="flex w-full justify-between items-center">
              <h4 className="text-[9px]">
                {dayjs(item?.purchaseDate).format("DD MMM YYYY, HH:mm")} WIB
              </h4>
              <Divider
                type="vertical"
                style={{ marginInline: 4 }}
                className="!bg-gray-200"
              />
              <div className="flex items-center text-[9px] gap-2">
                <h4>{item?.order_number || "No Content"}</h4>
                <CopyOutlined
                  style={{ cursor: "pointer" }}
                  onClick={(e) =>
                    handleCopyClick(item?.order_number as string, e)
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <>
                  <p
                    className={`px-2 py-1 text-[9px] rounded-xl font-semibold ${
                      transactionStatusStyle[
                        item?.paymentStatus?.toLowerCase() as TransactionStatus
                      ] ?? transactionStatusStyle[""]
                    }`}
                  >
                    {item?.paymentStatus}
                  </p>
                  <InfoCircleOutlined className="text-[9px]" />
                </>
              </div>
            </div>

            <Divider type="horizontal" className="!bg-gray-200 !mt-1 !mb-0" />

            <div className="p-2 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-[70px] h-[100px] rounded-xl overflow-hidden">
                  <Image
                    className="w-full h-full object-cover"
                    width={100}
                    height={100}
                    src={item?.book?.images?.[0]?.imageUrl || DefaultBook}
                    alt="book-order"
                  />
                </div>

                <div className="flex text-sm flex-col gap-0">
                  <h4 className="font-semibold text-[12px]">
                    {truncateText(item?.book?.title as string, 20)}
                  </h4>
                  <p className="text-gray-500 text-[9px]">
                    {item?.quantity}{" "}
                    {(item?.quantity as number) > 1 ? "Items" : "Item"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col">
                <p className="text-gray-500 text-[9px]">Price at Purchase</p>
                <h4 className="font-semibold text-[13px]">
                  Rp
                  {Number(item?.priceAtPurchases).toLocaleString("id-ID")}
                </h4>
              </div>
            </div>

            {item?.paymentStatus.toUpperCase() === "PENDING" && (
              <>
                <p className="text-red-500 text-[12px] px-4 pb-2">
                  Expire in: {formatTime(secondsLeft)}s
                </p>
              </>
            )}
          </div>

          <Modal
            open={isOpen}
            closable={true}
            footer={false}
            loading={loading}
            onCancel={() => setIsOpen(false)}
          >
            <div>
              <h4 className="font-semibold sm:text-xl text-xl">Order Info</h4>

              <div className="flex sm:px-4 py-1 justify-between items-center gap-3">
                <div className="flex items-center gap-4">
                  <h4 className="text-[12px] font-semibold text-gray-500">
                    Transaction Status:
                  </h4>
                  <h4
                    className={`px-2 py-1 rounded-xl text-[12px] font-semibold ${
                      transactionStatusStyle[
                        item?.paymentStatus?.toLowerCase() as TransactionStatus
                      ] ?? transactionStatusStyle[""]
                    }`}
                  >
                    {item?.paymentStatus}
                  </h4>
                </div>
              </div>
              <div className="flex sm:px-4 py-1 justify-between items-center gap-3">
                <div className="flex items-center gap-4">
                  <h4 className="text-[12px] font-semibold text-gray-500">
                    Order Number:
                  </h4>
                  <h4 className={` text-center text-[12px]`}>
                    {item?.order_number || "No Content"}
                  </h4>
                </div>
              </div>
              <div className="flex sm:px-4 py-1 justify-between items-center gap-3">
                <div className="flex items-center gap-4">
                  <h4 className="text-[12px] font-semibold text-gray-500">
                    Order Date:
                  </h4>
                  <h4 className={` text-center text-[12px]`}>
                    {dayjs(item?.purchaseDate).format("DD MMM YYYY, HH:mm")} WIB
                  </h4>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold text-xl">Product Details</h4>

              <div className=" mt-3 flex items-start flex-col">
                <div className="flex items-center gap-4">
                  <div className="w-[70px] h-[100px] rounded-xl overflow-hidden">
                    <Image
                      className="w-full h-full object-cover"
                      width={100}
                      height={100}
                      src={item?.book?.images?.[0]?.imageUrl || DefaultBook}
                      alt="book-order"
                    />
                  </div>

                  <div className="flex flex-col gap-0">
                    <h4 className="font-semibold text-[12px]">
                      {item?.book?.title}
                    </h4>
                    <p className="text-gray-500 text-[11px]">
                      {item?.quantity}{" "}
                      {(item?.quantity as number) > 1 ? "Items" : "Item"}
                    </p>
                  </div>
                </div>

                <div className="flex  gap-4 mt-2 items-center">
                  <p className="text-gray-500 text-[12px] font-semibold">
                    Price at Purchase:
                  </p>
                  <h4 className="font-semibold text-[15px]">
                    Rp
                    {Number(item?.priceAtPurchases).toLocaleString("id-ID")}
                  </h4>
                </div>
              </div>
            </div>

            {item?.paymentStatus === "PENDING" && (
              <div className="mt-4">
                <h4 className="font-semibold text-xl">Payment Details</h4>
                <div className="flex items-start flex-col">
                  <div className="flex sm:px-4 py-1 justify-between items-center gap-3">
                    <div className="flex items-center gap-4">
                      <h4 className="text-[12px] font-semibold text-gray-500">
                        Price Total:
                      </h4>
                      <h4 className={` text-center text-[12px] font-semibold`}>
                        {"Rp" +
                          Number(item?.priceAtPurchases)?.toLocaleString(
                            "id-ID",
                          ) || "No Content"}
                      </h4>
                    </div>
                  </div>
                  <div className="flex sm:px-4 py-1 justify-between items-center gap-3">
                    <div className="flex items-center gap-4">
                      <h4 className="text-[12px] font-semibold text-gray-500">
                        Payment Method:
                      </h4>
                      <h4 className={` text-center text-[12px]`}>
                        {capitalizeWords(
                          dataOrder?.payment_type as string,
                        )?.replace("_", " ") || "No Content"}
                      </h4>
                    </div>
                  </div>

                  <div className="flex sm:px-4 py-1 justify-between items-center gap-3">
                    <div className="flex items-center gap-4">
                      <h4 className="text-[12px] font-semibold text-gray-500">
                        Bank Name:
                      </h4>
                      <h4 className={` text-center text-[12px]`}>
                        {dataOrder?.va_numbers?.[0]?.bank.toUpperCase() ||
                          "No Content"}
                      </h4>
                    </div>
                  </div>
                  <div className="flex sm:px-4 py-1 justify-between items-center gap-3">
                    <div className="flex items-center gap-4">
                      <h4 className="text-[12px] font-semibold text-gray-500">
                        VA Number:
                      </h4>
                      <div className="flex items-center gap-2">
                        <h4 className={` text-center text-[12px]`}>
                          {dataOrder?.va_numbers?.[0]?.va_number ||
                            "No Content"}
                        </h4>

                        {dataOrder?.va_numbers?.[0]?.va_number !== null && (
                          <CopyOutlined
                            style={{ cursor: "pointer" }}
                            onClick={(e) =>
                              handleCopyClick(
                                dataOrder?.va_numbers?.[0]?.va_number as string,

                                e,
                              )
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        </>
      ) : (
        <>
          <div
            onClick={() =>
              handleOpenDetailOrder(
                item?.orderGroupId as string,
                item?.paymentStatus as string,
              )
            }
            className="p-4 cursor-pointer hover:shadow-xl sm:min-w-[485px] transition-all rounded-xl border border-gray-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h4>
                  {dayjs(item?.purchaseDate).format("DD MMM YYYY, HH:mm") +
                    " WIB" || "No Content"}
                </h4>

                <Divider
                  type="vertical"
                  style={{ marginInline: 0 }}
                  className="!bg-gray-200"
                />

                <div className="flex items-center gap-2">
                  <h4>{item?.order_number || "No Content"}</h4>
                  <CopyOutlined
                    style={{ cursor: "pointer" }}
                    onClick={(e) =>
                      handleCopyClick(item?.order_number as string, e)
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <>
                  <p
                    className={`px-2 py-1 rounded-xl font-semibold ${
                      transactionStatusStyle[
                        item?.paymentStatus?.toLowerCase() as TransactionStatus
                      ] ?? transactionStatusStyle[""]
                    }`}
                  >
                    {item?.paymentStatus}
                  </p>
                  <InfoCircleOutlined />
                </>
              </div>
            </div>

            <Divider type="horizontal" className="!bg-gray-200 !mt-5 !mb-0" />

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-[70px] h-[100px] rounded-xl overflow-hidden">
                  <Image
                    className="w-full h-full object-cover"
                    width={100}
                    height={100}
                    src={item?.book?.images?.[0]?.imageUrl || DefaultBook}
                    alt="book-order"
                  />
                </div>

                <div className="flex flex-col gap-0">
                  <h4 className="font-semibold text-[15px]">
                    {truncateText(item?.book?.title as string, 20)}
                  </h4>
                  <p className="text-gray-500">
                    {item?.quantity}{" "}
                    {(item?.quantity as number) > 1 ? "Items" : "Item"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col">
                <p className="text-gray-500">Price at Purchase</p>
                <h4 className="font-semibold text-[15px]">
                  Rp
                  {Number(item?.priceAtPurchases).toLocaleString("id-ID")}
                </h4>
              </div>
            </div>

            {item?.paymentStatus.toUpperCase() === "PENDING" && (
              <>
                <p className="text-red-500 text-sm px-4 pb-2">
                  Expire in: {formatTime(secondsLeft)}s
                </p>
              </>
            )}
          </div>

          <Modal
            open={isOpen}
            closable={true}
            footer={false}
            loading={loading}
            onCancel={() => setIsOpen(false)}
          >
            <div>
              <h4 className="font-semibold sm:text-xl text-sm">Order Info</h4>

              <div className="flex px-4 py-1 justify-between gap-3">
                <DetailItem
                  label="Transaction Status"
                  value={
                    <p
                      className={`px-2 py-1 rounded-xl text-center sm:text-sm text-[12px] font-semibold ${
                        transactionStatusStyle[
                          item?.paymentStatus?.toLowerCase() as TransactionStatus
                        ] ?? transactionStatusStyle[""]
                      }`}
                    >
                      {item?.paymentStatus}
                    </p>
                  }
                />
                <DetailItem label="Order Number" value={item?.order_number} />

                <DetailItem label="Order Date" value={"16 February 2026"} />
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold text-xl">Product Details</h4>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-[70px] h-[100px] rounded-xl overflow-hidden">
                    <Image
                      className="w-full h-full object-cover"
                      width={100}
                      height={100}
                      src={item?.book?.images?.[0]?.imageUrl || DefaultBook}
                      alt="book-order"
                    />
                  </div>

                  <div className="flex flex-col gap-0">
                    <h4 className="font-semibold text-[15px]">
                      {item?.book?.title}
                    </h4>
                    <p className="text-gray-500">
                      {item?.quantity}{" "}
                      {(item?.quantity as number) > 1 ? "Items" : "Item"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col">
                  <p className="text-gray-500">Price at Purchase</p>
                  <h4 className="font-semibold text-[15px]">
                    Rp
                    {Number(item?.priceAtPurchases).toLocaleString("id-ID")}
                  </h4>
                </div>
              </div>
            </div>

            {item?.paymentStatus === "PENDING" && (
              <div className="mt-4">
                <h4 className="font-semibold text-xl">Payment Details</h4>
                <div className="flex items-start gap-3 p-3 flex-col justify-between">
                  <DetailItem
                    label="Price Total"
                    value={item?.priceAtPurchases}
                  />
                  <DetailItem
                    label="Payment Method"
                    value={capitalizeWords(
                      dataOrder?.payment_type as string,
                    )?.replace("_", " ")}
                  />

                  <DetailItem
                    label="Bank Name"
                    value={dataOrder?.va_numbers?.[0]?.bank.toLocaleUpperCase()}
                  />
                  <DetailItem
                    label="VA Numbers"
                    value={
                      <div className="flex items-center gap-2">
                        <h4 className={` text-center text-[12px]`}>
                          {dataOrder?.va_numbers?.[0]?.va_number ||
                            "No Content"}
                        </h4>

                        {dataOrder?.va_numbers?.[0]?.va_number !== null && (
                          <div className="p-2 flex items-center justify-center hover:bg-gray-100 rounded-full cursor-pointer">
                            <CopyOutlined
                              style={{ cursor: "pointer" }}
                              onClick={(e) =>
                                handleCopyClick(
                                  dataOrder?.va_numbers?.[0]
                                    ?.va_number as string,

                                  e,
                                )
                              }
                            />
                          </div>
                        )}
                      </div>
                    }
                  />
                </div>
              </div>
            )}
          </Modal>
        </>
      )}
    </FadeUpWrapper>
  );
};

export default TransactionItem;
