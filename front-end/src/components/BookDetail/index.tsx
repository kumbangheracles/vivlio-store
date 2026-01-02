"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import DefaultImage from "../../assets/images/bookDefault.png";
import {
  Button,
  Tag,
  Typography,
  Space,
  Card,
  Rate,
  Divider,
  Badge,
  Carousel,
  message,
  Empty,
} from "antd";
import {
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import AppBreadcrumb from "../Breadcrumb";
import { BookProps } from "@/types/books.type";
import { GenreProperties } from "@/types/genre.type";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import myAxios from "@/libs/myAxios";
import { useIsWishlistStore } from "@/zustand/isWishlist.store";
import { ErrorHandler } from "@/helpers/handleError";
import { useWishlistStore } from "@/zustand/wishlist.store";
import { product } from "@/libs/product";
import useCart from "@/hooks/useCart";
import ListBook from "../Home/components/ListBook";
import { TitleList } from "../Home";
import useDeviceType from "@/hooks/useDeviceType";

const { Title, Text, Paragraph } = Typography;

interface BookDetailProps {
  book: BookProps;
  isInWishlist?: boolean;
  onAddToWishlist?: (bookId: string) => void;
  onRemoveFromWishlist?: (bookId: string) => void;
  onShare?: (book: BookProps) => void;
  onAddToCart?: (book: BookProps) => void;
  similiarBooks?: BookProps[];
}

const BookDetailPage: React.FC<BookDetailProps> = ({
  book,

  onShare,
  similiarBooks,
}) => {
  const isMobile = useDeviceType();
  const auth = useAuth();
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(
    book?.wishlistUsers?.length! > 0
  );
  const { fetchBooksHome } = useWishlistStore();
  const { setIsWishlist, isWishlist } = useIsWishlistStore();
  const [isCart, setIsCart] = useState<boolean>(book?.isInCart as boolean);
  const [loading, setLoading] = useState<boolean>(false);
  const bookId = book?.id;
  useEffect(() => {
    console.log("Book detail: ", book);
  }, [book]);
  console.log("Similiar Books: ", similiarBooks);
  const handleWishlistClick = async () => {
    if (!auth.accessToken) {
      message.info("You must login first.");
      router.push("/auth/login");

      return;
    }

    try {
      setLoading(true);

      if (isInWishlist === false) {
        await myAxios.post(`/userWishlist`, { bookId: bookId });
        message.success("Success add to wishlist");
        setIsInWishlist(true);
        setIsWishlist(bookId as string, true);
        isWishlist(bookId as string);
      } else {
        await myAxios.delete(`/userWishlist/${bookId}`);
        message.success("Success remove from wishlist");
        isWishlist(bookId as string);
        setIsInWishlist(false);
        setIsWishlist(bookId as string, false);
      }
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setLoading(false);
      // setModalOpen(false);

      await fetchBooksHome();
    }
  };

  const handleShareClick = () => {
    onShare?.(book);
  };

  const { handleAddToCart } = useCart({
    loading,
    setLoading,
    isCart,
    setIsCart,
    bookId: bookId as string,
  });

  // const handleAddToCart = async () => {
  //   if (!auth.accessToken) {
  //     message.info("You must login first!!!");
  //     router.push("/auth/login");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     if (!isCart) {
  //       await myAxios.post("/cart", { bookId });
  //       setIsCart(true);
  //       message.success("Success add to cart");
  //     } else {
  //       await myAxios.delete(`/cart/${bookId}`);
  //       setIsCart(false);
  //       message.success("Success remove from cart");
  //     }
  //   } catch (error) {
  //     ErrorHandler(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const data = {
        id: book?.id,
        productName: book?.title,
        price: book?.price,
        quantity: 1,
      };

      const res = await myAxios.post<{ redirect_url: string; token: string }>(
        "/midtrans/checkout",
        data
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
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen sm:w-auto sm:h-auto">
      <div className="max-w-7xl mx-auto p-2 sm:p-4">
        <Card className="rounded-lg overflow-hidden sm:!mt-4">
          <AppBreadcrumb isBook={true} bookName={book.title} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            <div className="!space-y-2">
              <div className="relative">
                {book.isPopular && (
                  <Badge.Ribbon text="Popular" color="red" className="z-10">
                    <div></div>
                  </Badge.Ribbon>
                )}

                {book?.images && book?.images.length > 0 ? (
                  <Carousel
                    autoplay
                    className="rounded-lg overflow-hidden flex justify-center items-center w-full sm:w-[300px] p-4 m-auto"
                  >
                    {book?.images.map((image, index) => (
                      <div key={index} className="relative h-95 w-full">
                        <Image
                          src={image?.imageUrl as string}
                          alt={
                            image?.bookId ||
                            `${book.title} - Image ${index + 1}`
                          }
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  <div className="relative h-96 w-full">
                    <Image
                      src={DefaultImage}
                      alt={`${book.title} cover`}
                      fill
                      className="object-cover rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Book Details */}
            <div className="space-y-6">
              {/* Title and Author */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <UserOutlined className="text-gray-500" />
                  <Text type="secondary" className="text-base">
                    {book.author}
                  </Text>
                </div>
                <Title
                  level={isMobile ? 5 : 1}
                  className="!mb-3 text-3xl font-bold text-gray-800"
                >
                  {book.title}
                </Title>
              </div>

              {/* Tags and Status */}
              <div className="flex flex-wrap gap-2">
                {book.categories && (
                  <Tag color="default" className="px-3 py-1">
                    {book.categories.name}
                  </Tag>
                )}
                {book.genres?.length! > 0 ? (
                  book.genres?.map((genre: GenreProperties, index) => (
                    <Tag key={index} color="geekblue" className="px-3 py-1">
                      {genre?.genre_title}
                    </Tag>
                  ))
                ) : (
                  <span className="text-gray-400">No genre</span>
                )}
              </div>

              {/* Price */}
              <div className="bg-blue-50 p-4 rounded-lg">
                {/* <Text className="text-sm text-gray-600">Price</Text> */}
                <Title level={isMobile ? 4 : 2} className="!mb-0 text-blue-600">
                  {formatPrice(book.price)}
                </Title>
              </div>

              {/* Stats */}
              {book.stats && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {book.stats.popularityScore && (
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="flex justify-center mb-1">
                        <Rate
                          disabled
                          defaultValue={book.stats.popularityScore / 20}
                          className="text-sm"
                        />
                      </div>
                      <Text className="text-xs text-gray-600">Rating</Text>
                    </div>
                  )}
                  {book.stats.purchaseCount !== undefined && (
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Title level={4} className="!mb-1 text-green-600">
                        {book.stats.purchaseCount}
                      </Title>
                      <Text className="text-xs text-gray-600">Sold</Text>
                    </div>
                  )}
                  {book.stats.wishlistCount !== undefined && (
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <Title level={4} className="!mb-1 text-red-600">
                        {book.stats.wishlistCount}
                      </Title>
                      <Text className="text-xs text-gray-600">Wishlisted</Text>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  loading={loading}
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  disabled={loading}
                  className="!flex-1 h-12 !font-semibold !p-3  !text-[12px] sm:!text-sm"
                >
                  {isCart ? "Remove From Cart" : "Add to Cart"}
                  {/* Buy */}
                </Button>

                <div className="flex flex-wrap gap-2 w-full">
                  <Button
                    loading={loading}
                    type={isWishlist(bookId as string) ? "primary" : "default"}
                    size="large"
                    icon={
                      isWishlist(bookId as string) ? (
                        <HeartFilled />
                      ) : (
                        <HeartOutlined />
                      )
                    }
                    disabled={loading}
                    onClick={handleWishlistClick}
                    className="h-12 px-6 w-full sm:w-auto !text-[12px] sm:!text-sm"
                    danger={isWishlist(bookId as string)}
                  >
                    {isWishlist(bookId as string)
                      ? "Remove From Wishlist"
                      : "Add to Wishlist"}
                  </Button>

                  <Button
                    type="default"
                    size="large"
                    icon={<ShareAltOutlined />}
                    onClick={handleShareClick}
                    className="h-12 px-6 !text-[12px] sm:!text-sm w-full sm:w-auto"
                  >
                    Share
                  </Button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                {book.createdAt && (
                  <div className="flex w-full gap-4">
                    <Text>
                      {new Date(book.createdAt).toLocaleDateString("id-ID")}
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {book.description && (
            <div className="w-full">
              <Divider orientation="left">
                <Title level={4} className="!mb-0">
                  Description
                </Title>
              </Divider>
              <div className="bg-gray-50 p-2 rounded-md text-base">
                <Paragraph className="text-gray-700 text-[10px]! text-base sm:text-sm! leading-relaxed">
                  <div
                    dangerouslySetInnerHTML={{ __html: book?.description }}
                  />
                </Paragraph>
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="min-h-[50vh]">
        {(similiarBooks?.length as number) > 0 ? (
          <ListBook
            dataBooks={similiarBooks}
            isSpace={true}
            titleSection="Similiar Books"
          />
        ) : (
          <>
            <div>
              <h4 className="p-4 ml-3 font-semibold tracking-wide text-xl sm:text-2xl">
                Similiar Books
              </h4>
              <Empty
                style={{ fontSize: isMobile ? 12 : 16 }}
                description="No Books has similiarity to this book"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookDetailPage;
