"use client";
import { Button, DatePicker, Input, Result, Select } from "antd";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import { TransactionProps } from "@/types/transaction.type";
import useTransaction from "@/hooks/useTransactions";
import TransactionItem from "./TransactionItem";
import { TransactionStatus } from "@/types/order.type";
import { cn } from "@/libs/cn";

interface PropTypes {
  dataTransactions: TransactionProps[];
}

const TransactionIndex = ({ dataTransactions }: PropTypes) => {
  const {
    handleLoadMore,
    hasMore,
    isPending,
    loadingMore,
    sort,
    sortDate,
    setSortDate,
    updateFiltersStatus,
    updateFilterDate,
    handleSearch,
    handleClear,
    key,
    setKey,
    handleClearDate,
  } = useTransaction({ dataTransactions });
  return (
    <div>
      <h4 className="font-semibold tracking-wide text-2xl mb-5">Transaction</h4>
      <div className="w-full">
        <div className="flex w-full justify-between">
          <div className="w-full flex items-center gap-4">
            <Input
              placeholder="Search book name or oder number"
              className="!w-[50%]"
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

          <div className="flex gap-3">
            <Select
              style={{ height: 38, minWidth: 120 }}
              defaultValue={""}
              options={[
                { label: "Pending", value: "pending" },
                { label: "Paid", value: "paid" },
                { label: "Cancel", value: "canceled" },
                { label: "All Payment", value: "" },
              ]}
              loading={isPending || loadingMore}
              placeholder="Transaction Status"
              onChange={(v) => updateFiltersStatus(v)}
            />
            <div className="flex items-center rounded-md focus:border-gray-400 hover:border-gray-400 transition-all cursor-pointer border-gray-200 border px-3">
              <DatePicker
                value={sortDate}
                style={{ minWidth: 110 }}
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

        <div
          className={`mt-5 flex w-full  gap-4 flex-wrap ${cn(dataTransactions?.length === 1 ? "justify-start" : "justify-center")}`}
        >
          {dataTransactions?.length === 0 ? (
            <div className="flex items-center justify-center w-full">
              <Result
                status={"404"}
                title={"No Transaction Found"}
                subTitle={`There's no transaction available for status ${sort}.`}
              />
            </div>
          ) : (
            <>
              {dataTransactions?.map((item, index) => (
                <TransactionItem index={index} item={item} key={item?.id} />
              ))}

              {hasMore && (
                <div className="flex items-center justify-start w-full ">
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
export default TransactionIndex;
