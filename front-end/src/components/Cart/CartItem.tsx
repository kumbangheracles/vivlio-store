"use client";
import { BookProps } from "@/types/books.type";
import { Button, Checkbox, message, Modal, Spin } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DefaultImage from "../../assets/images/default-img.png";
import { MdDelete } from "react-icons/md";
import useCart from "@/hooks/useCart";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { PropCheck } from ".";
import myAxios from "@/libs/myAxios";
import { ErrorHandler } from "@/helpers/handleError";
interface PropTypes {
  book: BookProps;
  isChecked?: PropCheck[];
  setIsChecked?: Dispatch<SetStateAction<PropCheck[]>>;
  books?: BookProps[];
  quantity?: number;
  setQuantity?: Dispatch<SetStateAction<number>>;
  handleChangeQuantity?: (type?: "add" | "remove", id?: string) => void;
  quantities?: Record<string, number>;
  setQuantities?: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  loadingIds?: boolean;
}

const CartItem = ({ book, isChecked, setIsChecked }: PropTypes) => {
  const router = useRouter();

  const goToDetail = (id: string) => {
    router.push(`/book/${id}`);
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(
    book?.UserCart?.quantity as number
  );
  const [isCart, setIsCart] = useState<boolean>(book?.isInCart as boolean);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isMounted = useRef<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { handleAddToCart } = useCart({
    loading,
    setLoading,
    isCart,
    setIsCart,
    bookId: book?.id as string,
  });
  const handleChangeQuantity = (type: "add" | "remove", id?: string) => {
    if (!id) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const newQty = type === "add" ? quantity + 1 : Math.max(quantity - 1, 1);

    setQuantity(newQty);
    setIsLoading(true);

    timerRef.current = setTimeout(async () => {
      try {
        await myAxios.patch(`/cart/${id}`, { type });
        router.refresh();
      } catch (err) {
        ErrorHandler(err);
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    }, 600);
  };
  useEffect(() => {
    setIsCart(true);
    if (book.UserCart?.quantity === 0) {
      handleChangeQuantity("add", book?.UserCart?.id);
    }
  }, [book.UserCart?.quantity]);

  const handleCart = () => {
    handleAddToCart();
  };
  useEffect(() => {
    setIsOpen(false);
    router.refresh();
  }, [isCart]);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div
      key={book?.id}
      className="flex items-center gap-3 sm:justify-between p-3 mx-1 mt-2 sm:mt-0 sm:mx-0 sm:m-3 border border-gray-300 rounded-xl sm:shadow-md  bg-white"
    >
      <div className="sm:flex hidden items-center gap-3 w-full">
        <Checkbox
          checked={isChecked?.some((item) => item.id === book.id)}
          // children={isLoading && <Spin />}
          onChange={(e) => {
            const checked = e.target.checked;
            setIsLoading(true);
            setTimeout(() => {
              router.refresh();

              if (checked) {
                setIsChecked?.((prev) => [
                  ...prev,
                  {
                    id: book?.id as string,
                    bookTitle: book?.title,
                    idCart: book?.UserCart?.id as string,
                  },
                ]);
                setIsLoading(false);
              } else {
                setIsChecked?.((prev) =>
                  prev.filter((item) => item.id !== book?.id)
                );

                setIsLoading(false);
              }
            }, 600);
          }}
        />

        <div className="flex items-center sm:justify-between w-full gap-4 ">
          {/* <p className="text-sm w-[100px] !font-medium">{book.author}</p> */}
          <div
            className="flex items-center justify-center w-[80px] h-[100px] rounded-sm sm:rounded-md overflow-hidden border-gray-300 border cursor-pointer"
            onClick={() => goToDetail(book?.id as string)}
          >
            <Image
              src={book?.images![0].imageUrl || DefaultImage}
              width={100}
              height={100}
              className="object-cover w-full h-full"
              alt={`cart-img-${book?.title}`}
            />
          </div>

          <div className="sm:flex sm:justify-between w-full hidden gap-1">
            <div className="flex flex-col gap-1">
              <span className="bg-gray-300 max-w-max rounded-md p-1 text-[10px] sm:text-xs text-gray-700 font-bold">
                {book?.book_type}
              </span>
              <h4 className="text-gray-700 text-[10px] sm:text-sm">
                {book?.title}
              </h4>
              <span className="sm:text-sm text-[12px] font-bold">
                {Number(book?.price).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                })}
              </span>
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <Button
                disabled={isLoading}
                color="default"
                onClick={() => setIsOpen(true)}
              >
                {isLoading ? (
                  <Spin size="small" />
                ) : (
                  <MdDelete className="text-red-400" />
                )}
              </Button>
              <div className="flex items-center gap-3">
                <Button
                  disabled={isLoading || quantity === 1}
                  onClick={() =>
                    handleChangeQuantity("remove", book?.UserCart?.id as string)
                  }
                >
                  {isLoading ? <Spin size="small" /> : "-"}
                </Button>
                <span>{quantity}</span>
                <Button
                  disabled={isLoading}
                  onClick={() =>
                    handleChangeQuantity("add", book?.UserCart?.id as string)
                  }
                >
                  {isLoading ? <Spin size="small" /> : "+"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================== Mobile View =========================*/}
      <div className="flex gap-3 sm:hidden">
        <Checkbox
          checked={isChecked?.some((item) => item.id === book.id)}
          onChange={(e) => {
            router.refresh();
            const checked = e.target.checked;
            if (checked) {
              setIsChecked?.((prev) => [
                ...prev,
                {
                  id: book?.id as string,
                  bookTitle: book?.title,
                  idCart: book?.UserCart?.id as string,
                },
              ]);
            } else {
              setIsChecked?.((prev) =>
                prev.filter((item) => item.id !== book?.id)
              );
            }
          }}
        />
        <div
          className="flex items-center justify-center w-[80px] h-[100px] rounded-sm sm:rounded-md overflow-hidden border-gray-300 border cursor-pointer"
          onClick={() => goToDetail(book?.id as string)}
        >
          <Image
            src={book?.images![0].imageUrl || DefaultImage}
            width={100}
            height={100}
            className="object-cover w-full h-full"
            alt={`cart-img-${book?.title}`}
          />
        </div>
        <div className="flex flex-col n gap-1">
          <div className="flex flex-col gap-1">
            <span className="bg-gray-300 max-w-max rounded-md p-1 text-[10px] sm:text-xs text-gray-700 font-bold">
              {book?.book_type}
            </span>
            <h4 className="text-gray-700 text-[10px] sm:text-sm">
              {book?.title}
            </h4>
            <span className="sm:text-sm text-[12px] font-bold">
              {Number(book?.price).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              })}
            </span>
          </div>
          <div className="flex justify-start items-center gap-3">
            <Button
              disabled={isLoading}
              color="default"
              onClick={() => setIsOpen(true)}
            >
              {isLoading ? (
                <Spin size="small" />
              ) : (
                <MdDelete className="text-red-400" />
              )}
            </Button>
            <div className="flex items-center gap-3">
              <Button
                disabled={isLoading || quantity === 1}
                onClick={() =>
                  handleChangeQuantity?.("remove", book?.UserCart?.id as string)
                }
              >
                {isLoading ? <Spin size="small" /> : "-"}
              </Button>
              <span>{quantity}</span>
              <Button
                disabled={isLoading}
                onClick={() =>
                  handleChangeQuantity?.("add", book?.UserCart?.id as string)
                }
              >
                {isLoading ? <Spin size="small" /> : "+"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        onOk={() => handleCart()}
        title={<h1 className="flex justify-center p-2">Remove from cart</h1>}
        closable
        centered={true}
        closeIcon={false}
        // loading={loading}
        confirmLoading={loading}
        children={
          <span className="flex justify-center">
            Are you sure want to delete {book?.title} from cart?
          </span>
        }
      />
    </div>
  );
};

export default CartItem;
