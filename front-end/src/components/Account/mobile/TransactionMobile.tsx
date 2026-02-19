"use client";

import useDeviceType from "@/hooks/useDeviceType";
import NotFoundPage from "../../NotFoundPage";
import {
  ArrowLeftOutlined,
  ClearOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { Button, DatePicker, Input, Result, Select } from "antd";
import useTransaction from "@/hooks/useTransactions";
import { TransactionProps } from "@/types/transaction.type";
import TransactionItem from "../TransactionItem";
import { cn } from "@/libs/cn";
import { useMounted } from "@/hooks/useMounted";
import GlobalLoading from "@/components/GlobalLoading";

interface PropTypes {
  dataTransactions?: TransactionProps[];
}

const TransactionMobileIndex = ({ dataTransactions }: PropTypes) => {
  const isMobile = useDeviceType();
  const router = useRouter();

  const {
    isPending,
    loadingMore,
    sort,
    sortDate,
    setSortDate,
    setKey,
    handleClear,
    handleClearDate,
    handleLoadMore,
    handleSearch,
    hasMore,
    key,
    updateFilterDate,
    updateFiltersStatus,
  } = useTransaction({ dataTransactions });
  const mounted = useMounted();

  if (!mounted) return <GlobalLoading />;
  if (!isMobile) {
    return <NotFoundPage />;
  }
  return (
    <div className="mt-[-15px]">
      <div className="fixed top-0 bg-white shadow-sm justify-between flex w-full px-3 py-4 z-[999]">
        <div className="flex items-center gap-2">
          <ArrowLeftOutlined onClick={() => router.back()} />
          <h4 className="text-sm font-bold tracking-wide">Transactions</h4>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col gap-3 !w-full p-2 ">
          <div className="w-full flex items-center gap-4">
            <Input
              placeholder="Search book name or oder number"
              className="!w-[100%]"
              prefix={<SearchOutlined />}
              style={{ height: 38 }}
              value={key as string}
              onChange={(value) => setKey(value.target.value)}
              onKeyDown={(e) => {
                if (key?.trim() === "") {
                  return;
                }
                if (e.key === "Enter") handleSearch();
              }}
              allowClear
              onClear={() => handleClear()}
            />
            <Button
              type="primary"
              style={{ height: 38 }}
              onClick={() => {
                if (key?.trim() === "") {
                  return;
                }
                handleSearch();
              }}
            >
              Search
            </Button>
          </div>

          <div className="flex gap-3 w-full ">
            <Select
              style={{ minWidth: "50%" }}
              defaultValue={""}
              options={[
                { label: "Pending", value: "pending" },
                { label: "Paid", value: "paid" },
                { label: "Cancel", value: "canceled" },
                { label: "All Payment", value: "" },
              ]}
              loading={isPending || loadingMore}
              placeholder="Filter By Status"
              onChange={(v) => updateFiltersStatus(v)}
            />
            <div className="flex items-center rounded-md focus:border-gray-400 hover:border-gray-400 transition-all cursor-pointer border-gray-200 border px-3">
              <DatePicker
                value={sortDate}
                style={{ minWidth: "50%" }}
                onChange={(date) => {
                  setSortDate(date);
                  updateFilterDate(date ? date.format("YYYY-MM-DD") : "");
                }}
                variant="borderless"
                allowClear={false}
              />

              {sortDate && (
                <div
                  onClick={() => {
                    setSortDate(null);
                    updateFilterDate("");
                  }}
                  className="!p-4 transition-all flex items-center justify-center rounded-full w-[10px] h-[10px] hover:!bg-gray-300"
                >
                  <ClearOutlined />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={`flex full gap-4 flex-col justify-center items-center`}>
          {dataTransactions?.length === 0 ? (
            <div className="flex items-center justify-center w-full">
              <Result
                status={"404"}
                title={"No Transaction Found"}
                subTitle={`There's no transaction available.`}
              />
            </div>
          ) : (
            <>
              <div className="mt-[-8px]">
                {dataTransactions?.map((item, index) => (
                  <TransactionItem index={index} item={item} key={item?.id} />
                ))}
              </div>

              {hasMore && (
                <div className="flex items-center px-2 justify-start w-full ">
                  <Button
                    loading={isPending || loadingMore}
                    disabled={isPending || loadingMore}
                    onClick={() => handleLoadMore()}
                    type="primary"
                  >
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionMobileIndex;
