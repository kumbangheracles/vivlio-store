"use client";
import { Button, Card, Checkbox, Divider, Empty, message } from "antd";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import styled from "styled-components";
import { cn } from "@/libs/cn";
import { BookProps } from "@/types/books.type";
import CartItem from "./CartItem";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
interface PropTypes {
  books: BookProps[];
}

export interface PropCheck {
  id: string;
  bookTitle?: string;
}

const CartIndex = ({ books }: PropTypes) => {
  const auth = useAuth();

  const quantityBooksRecord = books?.reduce((acc, item) => {
    if (item?.id && typeof item?.quantity === "number") {
      acc[item.id] = item.quantity;
    }
    return acc;
  }, {} as Record<string, number>);

  const [checkedAll, setCheckedAll] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<PropCheck[]>([]);
  const [quantity, setQuantity] = useState<number>(0);
  const [quantities, setQuantities] = useState<Record<string, number>>(
    quantityBooksRecord ?? {}
  );

  const router = useRouter();
  useEffect(() => {
    if (auth.loading) return;
    if (!auth.accessToken) {
      message.info("You must login first!!!");
      router.push("/auth/login");
    }
  }, [auth.loading, auth.accessToken]);

  useEffect(() => {
    if (isChecked.length === books?.length) {
      setCheckedAll(true);
    } else {
      setCheckedAll(false);
    }
  }, [isChecked]);

  const mappinCheckedbook = isChecked.map((item: PropCheck) => item.id);

  const isCheckedBooks = books?.filter((item: BookProps) =>
    mappinCheckedbook.includes(item.id as string)
  );

  const handleCheckAll = (e: CheckboxChangeEvent) => {
    if (!books?.length) return;
    const checked = e.target.checked;
    setCheckedAll(checked);

    if (checked) {
      const allBooks =
        books?.map((book) => ({
          id: book.id as string,
          bookTitle: book.title,
        })) ?? [];

      setIsChecked(allBooks);
      setCheckedAll(true);
    } else {
      setIsChecked([]);
      setCheckedAll(false);
    }
  };
  // Simpan ke localStorage setiap kali isChecked berubah
  useEffect(() => {
    localStorage.setItem("checkedBooks", JSON.stringify(isChecked));
  }, [isChecked]);

  // Ambil dari localStorage saat pertama kali render
  useEffect(() => {
    const savedChecked = localStorage.getItem("checkedBooks");
    if (savedChecked) {
      setIsChecked(JSON.parse(savedChecked));
    }
  }, []);

  useEffect(() => {
    const savedChecked = localStorage.getItem("checkedBooks");
    if (savedChecked) {
      const parsed = JSON.parse(savedChecked);
      setIsChecked(parsed);

      // kalau jumlah yang dicentang sama dengan jumlah buku
      if (parsed.length > 0 && parsed.length === books?.length) {
        setCheckedAll(true);
      } else {
        setCheckedAll(false);
      }
    }
  }, [books]);

  const totalQuantity: number = (isCheckedBooks ?? []).reduce(
    (acc: number, item: BookProps) => acc + Number(item.quantity),
    0
  );

  return (
    <div>
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
          <div className="sm:p-4 p-0">
            <h4 className="font-bold  text-lg sm:text-2xl">Cart</h4>
            <div className="relative w-full flex flex-col sm:flex-row gap-6">
              <div className="flex justify-start flex-col !w-full sm:!w-[65%]">
                <div className="hidden sm:flex items-center justify-between p-3 my-3 w-full border-gray-300 border rounded-xl shadow-md transition-all">
                  <div className="flex items-center gap-3 p-2 text-base">
                    <Checkbox checked={checkedAll} onChange={handleCheckAll} />
                    <h4>Select All {`(${isCheckedBooks?.length})`}</h4>
                  </div>

                  <Button
                    // loading={}
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
                    <CartItem
                      key={item.id}
                      book={item}
                      isChecked={isChecked}
                      setIsChecked={setIsChecked}
                      books={books}
                      // handleChangeQuantity={handleChangeQuantity}
                      quantity={quantity}
                      setQuantity={setQuantity}
                      quantities={quantities}
                      setQuantities={setQuantities}
                    />
                  ))}
                </>
              </div>
              <div className="w-full hidden sm:block sm:w-[30%]">
                <div className="p-7 w-full shadow-md border border-gray-300 rounded-xl sticky top-35">
                  <h4 className="font-bold mb-2">Cart Review</h4>
                  <div className="flex items-center justify-between text-gray-500">
                    <p>Total Item{`(${totalQuantity})`}</p>
                    <p>
                      Rp
                      {isCheckedBooks
                        ?.reduce(
                          (acc, item) =>
                            acc +
                            Number(item?.price || 0) * Number(item?.quantity),
                          0
                        )
                        .toLocaleString("id-ID")}
                    </p>
                  </div>

                  <Divider className="bg-gray-300" />
                  <div className="flex items-center justify-between font-bold mb-5">
                    <h4>Subtotal</h4>
                    <h4>
                      Rp{" "}
                      {isCheckedBooks
                        ?.reduce(
                          (acc, item) =>
                            acc +
                            Number(item?.price || 0) * Number(item?.quantity),
                          0
                        )
                        .toLocaleString("id-ID")}
                    </h4>
                  </div>
                  <Button className="!bg-blue-500 !text-white !rounded-lg !w-full !border-none !shadow-md !py-6 !font-bold hover:!bg-blue-300">
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="sm:hidden flex w-full px-2 py-4 justify-between base-blue fixed shadow-md bottom-0 left-0">
            <div className="flex items-center gap-2">
              <Checkbox checked={checkedAll} onChange={handleCheckAll} />
              <p className="text-sm">Select All</p>
            </div>

            <div className="flex items-center gap-1 text-sm">
              <p>
                {" "}
                Rp
                {isCheckedBooks
                  ?.reduce(
                    (acc, item) =>
                      acc + Number(item?.price || 0) * Number(item?.quantity),
                    0
                  )
                  .toLocaleString("id-ID")}
              </p>
              <button className="bg-blue-500 !active:bg-blue-300 text-white rounded-md w-full border-none px-2 py-2 font-bold hover:bg-blue-300">
                Checkout {`(${isCheckedBooks?.length})`}
              </button>
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
