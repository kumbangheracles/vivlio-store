"use client";
import { BookProps } from "@/types/books.type";
import { Button, Checkbox, message, Modal } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DefaultImage from "../../assets/images/default-img.png";
import { MdDelete } from "react-icons/md";
import useCart from "@/hooks/useCart";
import { Dispatch, SetStateAction, useState } from "react";
import { PropCheck } from ".";
import { useAuth } from "@/hooks/useAuth";
import myAxios from "@/libs/myAxios";
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
}

const CartItem = ({
  book,
  isChecked,
  books,
  setIsChecked,
  // handleChangeQuantity,
  // quantity,
  // setQuantity,
  quantities,
  setQuantities,
}: PropTypes) => {
  const router = useRouter();

  const goToDetail = (id: string) => {
    router.push(`/book/${id}`);
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(book?.quantity as number);
  const [isCart, setIsCart] = useState<boolean>(book?.isInCart as boolean);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { handleAddToCart } = useCart({
    loading,
    setLoading,
    isCart,
    setIsCart,
    bookId: book?.id as string,
  });

  console.log("Books: quantity: ", quantity);

  const handleCart = () => {
    handleAddToCart();
    setIsOpen(false);
    router.refresh();
  };

  const handleChangeQuantity = async (type?: "add" | "remove", id?: string) => {
    if (!id) return;

    try {
      setQuantity((prev) => {
        // Hitung quantity baru
        const newQty = type === "add" ? prev + 1 : Math.max(prev - 1, 1);

        // Update backend (async terpisah)
        myAxios
          .patch(`/books/${id}`, { quantity: newQty })
          .then(() => console.log("Updated:", newQty))
          .catch((err) => console.error("Failed to update:", err));

        // Return nilai baru ke React
        return newQty;
      });
    } catch (error) {
      console.error("Error changing quantity:", error);
    }
  };

  return (
    <div
      key={book?.id}
      className="flex items-center justify-between p-3 m-3 border border-gray-300 rounded-xl shadow-md"
    >
      <div className="flex items-center gap-3">
        <Checkbox
          checked={isChecked?.some((item) => item.id === book.id)}
          onChange={(e) => {
            const checked = e.target.checked;
            if (checked) {
              setIsChecked?.((prev) => [
                ...prev,
                { id: book?.id as string, bookTitle: book?.title },
              ]);
            } else {
              setIsChecked?.((prev) =>
                prev.filter((item) => item.id !== book?.id)
              );
            }
          }}
        />
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => goToDetail(book?.id as string)}
        >
          <div className="flex items-center justify-center w-[80px] h-[100px]  rounded-md overflow-hidden border-gray-300 border">
            <Image
              src={book?.images![0].imageUrl || DefaultImage}
              width={100}
              height={100}
              className="object-cover w-full h-full"
              alt={`cart-img-${book?.title}`}
            />
          </div>

          <div>
            <span className="bg-gray-300 rounded-md p-1 text-xs text-gray-700 font-bold">
              {book?.book_type}
            </span>
            <h4 className="text-gray-700 text-sm">{book?.title}</h4>
            <span className="text-sm font-bold">
              {Number(book?.price).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button color="default" onClick={() => setIsOpen(true)}>
          <MdDelete className="text-red-400" />
        </Button>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => handleChangeQuantity?.("remove", book?.id as string)}
          >
            -
          </Button>
          <span>{quantity}</span>
          <Button
            onClick={() => handleChangeQuantity?.("add", book?.id as string)}
          >
            +
          </Button>
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
        loading={loading}
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
