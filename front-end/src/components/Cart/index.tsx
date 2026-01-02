"use client";
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Empty,
  message,
  Modal,
  Result,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import styled from "styled-components";
import { cn } from "@/libs/cn";
import { BookProps } from "@/types/books.type";
import CartItem from "./CartItem";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import myAxios from "@/libs/myAxios";
import { ErrorHandler } from "@/helpers/handleError";
import { ArrowLeftOutlined } from "@ant-design/icons";
interface PropTypes {
  books: BookProps[];
}

export interface PropCheck {
  id: string;
  idCart: string;
  bookTitle?: string;
}

const CartIndex = ({ books }: PropTypes) => {
  const auth = useAuth();

  const quantityBooksRecord = books?.reduce((acc, item) => {
    if (item?.UserCart?.id && typeof item?.UserCart?.quantity === "number") {
      acc[item?.UserCart?.id] = item?.UserCart.quantity;
    }
    return acc;
  }, {} as Record<string, number>);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [checkedAll, setCheckedAll] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<PropCheck[]>([]);
  const [checkedIds, setCheckedIds] = useState<Array<string>>([]);
  const [quantity, setQuantity] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quantities, setQuantities] = useState<Record<string, number>>(
    quantityBooksRecord ?? {}
  );
  const [isChange, setIsChange] = useState<boolean>(false);

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
    router.refresh();
    const checked = e.target.checked;
    setCheckedAll(checked);

    if (checked) {
      const allBooks =
        books?.map((book) => ({
          id: book?.id as string,
          bookTitle: book.title,
          idCart: book?.UserCart?.id as string,
        })) ?? [];

      setIsChecked(allBooks);
    } else {
      setIsChecked([]);
    }
  };

  const isCheckedIds = isChecked.map((item) => item.idCart);
  useEffect(() => {
    setCheckedIds(isCheckedIds);

    console.log("Ids: ", checkedIds);
  }, [isChecked]);

  const handleBulkDelete = async (ids: Array<string>) => {
    if (ids.length === 0) {
      return message.error("Select at least one book to remove!.");
    }
    try {
      setIsLoading(true);

      await myAxios.delete("/cart/bulk-remove", { data: { ids: ids } });
      if (ids.length === 1) {
        message.success("Success delete book from cart.");
      } else if (ids.length === isCheckedBooks.length) {
        message.success("Success delete all books from cart.");
      } else if (ids.length > 1) {
        message.success("Success delete books from cart.");
      }
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setIsOpen(false);
      setIsLoading(false);
      router.refresh();
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
    (acc: number, item: BookProps) => acc + Number(item.UserCart?.quantity),
    0
  );

  const handleBulkCheckout = async () => {
    if (isCheckedBooks.length === 0) {
      return message.error("Select at least one book to checkout!.");
    }
    try {
      setIsLoading(true);

      const res = await myAxios.post<{ redirect_url: string; token: string }>(
        "/midtrans/bulk-checkout",
        { isCheckedBooks }
      );

      console.log("Data sended: ", res.data);

      if (res) {
        // router.push(res.data?.redirect_url);
        window.snap.pay(res.data.token); // untuk menampilkan pop-up payment dari midtrans
      }

      // message.info("checkout success you'll be redirect to midtrans payment");
    } catch (error) {
      console.log("Error checkout: ", error);
      ErrorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Navbar Cart */}
      <div className="py-5 px-4 bg-white shadow-sm flex fixed left-0 z-50 top-0 w-full justify-between items-center sm:hidden">
        <div className="flex gap-4 items-center">
          <ArrowLeftOutlined onClick={() => router.back()} />
          <h4 className="font-semibold tracking-wider">
            My Cart ({books.length})
          </h4>
        </div>

        {books.length !== 0 && (
          <p className="mr-2" onClick={() => setIsChange((prev) => !prev)}>
            {isChange ? "Completed" : "Change"}
          </p>
        )}
      </div>

      {books.length === 0 ? (
        <div className="p-4 w-full h-full">
          <div className="flex items-center justify-center h-screen w-full flex-col gap-3">
            <Result
              status={404}
              className="cart-result"
              title={"Looks like you haven’t added anything to your cart yet."}
              extra={
                <Button type="primary" onClick={() => router.push("/")}>
                  Let's Shop First
                </Button>
              }
            />
          </div>
        </div>
      ) : (
        <>
          <div className="sm:p-4 p-0">
            <h4 className="font-bold mx-3 sm:mx-2 sm:mt-4 text-lg sm:text-2xl">
              Cart
            </h4>
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
                    onClick={() => setIsOpen(true)}
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

              {/* Checkout Card */}
              <div className="w-full hidden sm:block sm:w-[30%] my-3">
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
                            Number(item?.price || 0) *
                              Number(item?.UserCart?.quantity),
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
                            Number(item?.price || 0) *
                              Number(item?.UserCart?.quantity),
                          0
                        )
                        .toLocaleString("id-ID")}
                    </h4>
                  </div>
                  <Button
                    onClick={() => handleBulkCheckout()}
                    loading={isLoading}
                    disabled={isCheckedBooks.length === 0}
                    className="!bg-blue-500 !text-white !rounded-lg !w-full !border-none !shadow-md !py-6 !font-bold hover:!bg-blue-300"
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Cart Mobile */}
          <div className="sm:hidden flex w-full px-4 py-4 justify-between base-blue fixed shadow-md bottom-0 left-0">
            <div className="flex items-center gap-2">
              <Checkbox checked={checkedAll} onChange={handleCheckAll} />
              <p className="text-sm">Select All</p>
            </div>

            <div className="flex items-center gap-1 text-sm">
              {!isChange && (
                <p>
                  {" "}
                  Rp
                  {isCheckedBooks
                    ?.reduce(
                      (acc, item) =>
                        acc +
                        Number(item?.price || 0) *
                          Number(item?.UserCart?.quantity),
                      0
                    )
                    .toLocaleString("id-ID")}
                </p>
              )}

              {isChange ? (
                <button
                  className="bg-red-500 px-4 !active:bg-blue-300 text-white rounded-md w-full border-none  py-2 font-bold hover:red-blue-300"
                  onClick={() => {
                    if (isCheckedBooks.length === 0) {
                      return message.error(
                        "Select at least one book to remove!."
                      );
                    }
                    setIsOpen(true);
                  }}
                >
                  Delete
                </button>
              ) : (
                <button
                  onClick={() => handleBulkCheckout()}
                  disabled={isCheckedBooks.length === 0}
                  className="bg-blue-500 !active:bg-blue-300 text-white rounded-md w-full border-none px-2 py-2 font-bold hover:bg-blue-300"
                >
                  {isLoading ? (
                    <Spin size="small" />
                  ) : (
                    <>Checkout {`(${totalQuantity})`}</>
                  )}
                </button>
              )}
            </div>
          </div>

          <Modal
            open={isOpen}
            onCancel={() => {
              setIsOpen(false);
            }}
            onOk={() => handleBulkDelete(checkedIds)}
            title={
              <h1 className="flex justify-center p-2">Remove from cart</h1>
            }
            closable
            centered={true}
            closeIcon={false}
            // loading={loading}
            confirmLoading={isLoading}
            children={
              <span className="flex justify-center">
                Are you sure want to delete these book from cart?
              </span>
            }
          />
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
