"use client";
import { Button, Card, Checkbox, Divider } from "antd";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import styled from "styled-components";
import { cn } from "@/libs/cn";
import Image from "next/image";
import { BookProps } from "@/types/books.type";
import DefaultImage from "../../assets/images/default-img.png";
import { useRouter } from "next/navigation";
import useDeviceType from "@/hooks/useDeviceType";
interface PropTypes {
  books: BookProps[];
}

const CartIndex = ({ books }: PropTypes) => {
  const [checkedAll, setCheckedAll] = useState<boolean>(false);
  const router = useRouter();
  const isMobile = useDeviceType();
  const goToDetail = (id: string) => {
    router.push(`/book/${id}`);
  };
  return (
    <div className="p-4">
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
              {books.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 m-3 border border-gray-300 rounded-xl shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox />
                    <div
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => goToDetail(item?.id as string)}
                    >
                      <div className="flex items-center justify-center w-[80px] h-[100px]  rounded-md overflow-hidden">
                        <Image
                          src={item?.images![0].imageUrl || DefaultImage}
                          width={100}
                          height={100}
                          className="object-contain"
                          alt={`cart-img-${item.title}`}
                        />
                      </div>

                      <div>
                        <span className="bg-gray-300 rounded-md p-1 text-xs text-gray-700 font-bold">
                          {item?.book_type}
                        </span>
                        <h4 className="text-gray-700 text-sm">{item?.title}</h4>
                        <span className="text-sm font-bold">Rp200.000</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button color="default">
                      <MdDelete className="text-red-400" />
                    </Button>
                    <div className="flex items-center gap-3">
                      <Button>-</Button>
                      <span>0</span>
                      <Button>+</Button>
                    </div>
                  </div>
                </div>
              ))}
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
