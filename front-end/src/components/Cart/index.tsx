"use client";
import { Button, Card, Checkbox, Divider, Empty, message } from "antd";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import styled from "styled-components";
import { cn } from "@/libs/cn";
import { BookProps } from "@/types/books.type";
import useDeviceType from "@/hooks/useDeviceType";
import CartItem from "./CartItem";
import type { CheckboxChangeEvent } from "antd/es/checkbox";

import { useRouter } from "next/navigation";
import myAxios from "@/libs/myAxios";
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

  const isMobile = useDeviceType();
  const router = useRouter();
  useEffect(() => {
    if (auth.loading) return;
    if (!auth.accessToken) {
      message.info("You must login first!!!");
      router.push("/auth/login");
    }
  }, [auth.loading, auth.accessToken]);

  useEffect(() => {
    console.log("Is Checked: ", isChecked);

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

  // const handleChangeQuantity = (type?: "add" | "remove", id?: string) => {
  //   try {
  //     let changePrev = 0;
  //     setQuantity((prev) => {
  //       if (type === "add") {
  //         changePrev = prev + 1;
  //         myAxios.patch(`/books/${id}`, { quantity: changePrev });
  //         console.log("Add: ", changePrev);
  //         prev = changePrev;
  //       } else if (type === "remove") {
  //         changePrev = prev > 1 ? prev - 1 : 1;
  //         myAxios.patch(`/books/${id}`, { quantity: changePrev });
  //         prev = changePrev;
  //       }
  //       return prev;
  //     });
  //   } catch (error) {
  //     console.error("Error changing quantity:", error);
  //   }
  // };

  const handleChangeQuantity = async (type?: "add" | "remove", id?: string) => {
    if (!id || !type) return;

    try {
      // Ambil current quantity dari state sekarang
      const currentQty = quantities[id] || 1;
      let newQty = currentQty;

      if (type === "add") {
        newQty = currentQty + 1;
      } else if (type === "remove") {
        newQty = currentQty > 1 ? currentQty - 1 : 1;
      }

      // Update state lokal dulu agar UI langsung terasa responsif
      setQuantities((prev) => ({
        ...prev,
        [id]: newQty,
      }));

      // Lalu kirim patch ke backend
      const res = await myAxios.patch(`/books/${id}`, { quantity: newQty });

      // Optional: bisa log hasil dari server untuk debugging
      console.log(` Quantity updated for ${id}:`, res.data);
    } catch (error) {
      console.error("Error updating quantity:", error);
      // Optional: rollback ke quantity sebelumnya jika gagal
      setQuantities((prev) => ({
        ...prev,
        [id]: quantities[id],
      }));
    }
  };

  const totalQuantity: number = (isCheckedBooks ?? []).reduce(
    (acc: number, item: BookProps) => acc + Number(item.quantity),
    0
  );

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
          {/* {isMobile ? (
            <></>
          ) : ( */}
          <>
            <h4 className="font-bold text-2xl">Cart</h4>
            <div className="relative w-full flex flex-col sm:flex-row gap-6">
              <div className="flex justify-start flex-col !w-[370px] sm:!w-[65%]">
                <div className="flex items-center justify-between p-3 m-3 w-full border-gray-300 border rounded-xl shadow-md transition-all">
                  <div className="flex items-center gap-3 p-2 text-base">
                    <Checkbox checked={checkedAll} onChange={handleCheckAll} />
                    <h4>Select All {`(${isCheckedBooks?.length})`}</h4>
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
                    <CartItem
                      book={item}
                      isChecked={isChecked}
                      setIsChecked={setIsChecked}
                      books={books}
                      handleChangeQuantity={handleChangeQuantity}
                      quantity={quantity}
                      setQuantity={setQuantity}
                      quantities={quantities}
                      setQuantities={setQuantities}
                    />
                  ))}
                </>
              </div>
              <div className="w-full sm:w-[30%]">
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
          </>
          {/* )} */}
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
