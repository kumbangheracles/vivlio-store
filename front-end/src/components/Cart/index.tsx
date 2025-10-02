"use client";
import { Button, Card, Checkbox, Divider, Empty } from "antd";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import styled from "styled-components";
import { cn } from "@/libs/cn";
import { BookProps } from "@/types/books.type";
import useDeviceType from "@/hooks/useDeviceType";
import CartItem from "./CartItem";
import { useRouter } from "next/navigation";
interface PropTypes {
  books: BookProps[];
}

const CartIndex = ({ books }: PropTypes) => {
  const [checkedAll, setCheckedAll] = useState<boolean>(false);

  const isMobile = useDeviceType();
  const router = useRouter();
  return (
    <div className="p-4 ">
      {books.length === 0 ? (
        <div className="p-4 w-full h-full">
          <div className="flex items-center justify-center h-screen w-full flex-col gap-3">
            <Empty description="Your cart is empty" />
            <Button
              type="primary"
              className="!p-4"
              onClick={() => router.push("/")}
            >
              Let's Shop First
            </Button>
          </div>
        </div>
      ) : (
        <>
          {isMobile ? (
            <></>
          ) : (
            <>
              <h4 className="font-bold text-2xl">Cart</h4>
              <div className="relative flex gap-6">
                <div className="flex justify-start flex-col w-[65%]">
                  <div className="flex items-center justify-between p-3 m-3 border-gray-300 border rounded-xl shadow-md transition-all">
                    <div className="flex items-center gap-3 p-2 text-base">
                      <Checkbox
                        checked={checkedAll}
                        onChange={() => setCheckedAll((prev) => !prev)}
                      />
                      <h4>Select All {"(0)"}</h4>
                    </div>

                    <Button
                      icon={<MdDelete />}
                      className={`!flex !items-center !gap-1 !text-base !cursor-pointer !p-2 !bg-red-400 !rounded-xl !font-bold !text-white hover:!bg-red-900 ${cn(
                        !checkedAll && "!hidden"
                      )} `}
                    >
                      {checkedAll && (
                        <>
                          <h4>Delete</h4>
                        </>
                      )}
                    </Button>
                  </div>

                  <>
                    {books.map((item) => (
                      <CartItem book={item} />
                    ))}
                  </>
                </div>
                <div className="w-[30%]">
                  <div className="p-7 w-full shadow-md border border-gray-300 rounded-xl sticky top-35">
                    <h4 className="font-bold mb-2">Cart Review</h4>
                    <div className="flex items-center justify-between text-gray-500">
                      <p>Total Price Item{"(1)"}</p>
                      <p>Rp500.000</p>
                    </div>

                    <Divider className="bg-gray-300" />
                    <div className="flex items-center justify-between font-bold mb-5">
                      <h4>Subtotal</h4>
                      <h4>Rp500.000</h4>
                    </div>
                    <Button className="!bg-blue-500 !text-white !rounded-lg !w-full !border-none !shadow-md !py-6 !font-bold hover:!bg-blue-300">
                      Checkout
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CartIndex;

const StyledCard = styled(Card)`
  .ant-card-body {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;

    border: 1px solid black;
  }
  width: 100%;
`;
