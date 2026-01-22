"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

import DefaultImage from "../../assets/images/bookDefault.png";
import {
  Button,
  Tag,
  Typography,
  Card,
  Rate,
  Divider,
  Badge,
  Carousel,
  message,
  Empty,
  Select,
  Modal,
  Input,
} from "antd";
import {
  HeartOutlined,
  HeartFilled,
  ShoppingCartOutlined,
  UserOutlined,
  StarFilled,
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
import useCart from "@/hooks/useCart";
import ListBook from "../Home/components/ListBook";
import useDeviceType from "@/hooks/useDeviceType";
import { truncateText } from "@/helpers/truncateText";
import StarLabel from "./StarLabel";
import styled from "styled-components";
import AppRate from "../AppRate";
import { BookReviewsProps, initialBookReview } from "@/types/bookreview.type";
import { isEmpty } from "@/helpers/validation";
import dayjs from "dayjs";

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
type OptionTypeScore = "highest_score" | "lowest_score";
type OptionTypeStar = "all_score" | 1 | 2 | 3 | 4 | 5;

const BookDetailPage: React.FC<BookDetailProps> = ({
  book,

  onShare,
  similiarBooks,
}) => {
  const isMobile = useDeviceType();
  const auth = useAuth();
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(
    book?.wishlistUsers?.length! > 0,
  );
  const { fetchBooksHome } = useWishlistStore();
  const { setIsWishlist, isWishlist } = useIsWishlistStore();
  const [isCart, setIsCart] = useState<boolean>(book?.isInCart as boolean);
  const [baseLength, setBaseLength] = useState<number>(300);
  const [dataReview, setDataReview] =
    useState<BookReviewsProps>(initialBookReview);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isModalReview, setIsModalReview] = useState<boolean>(false);
  const [rating, setRating] = useState(3);

  const [loading, setLoading] = useState<boolean>(false);
  const bookId = book?.id;
  useEffect(() => {
    console.log("Book detail: ", book);
  }, [book]);
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
      // router.refresh();
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmitReview = async (data: BookReviewsProps) => {
    if (data?.comment?.length! < 10) {
      message.error("Comment Atleast 10 characters!.");
      return;
    }
    if (isEmpty(data.comment)) {
      message.error("Comment are required!.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        rating: rating,
        comment: data?.comment,
        bookId: book?.id,
        userId: auth?.user?.id,
      };

      const res = await myAxios.post(`/book-reviews/${bookId}`, payload);
      if (res) {
        message.success("Success create review");
      }
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setLoading(false);
      setIsModalReview(false);
      router.refresh();
    }
  };

  // useEffect(() => {
  //   setDefaultValueStar(5);
  // }, [isModalReview]);

  // const handleCheckout = async () => {
  //   try {
  //     setLoading(true);
  //     const data = {
  //       id: book?.id,
  //       productName: book?.title,
  //       price: book?.price,
  //       quantity: 1,
  //     };

  //     const res = await myAxios.post<{ redirect_url: string; token: string }>(
  //       "/midtrans/checkout",
  //       data,
  //     );

  //     console.log("Data sended: ", res.data);

  //     if (res) {
  //       // router.push(res.data?.redirect_url);
  //       window.snap.pay(res.data.token); // untuk menampilkan pop-up payment dari midtrans
  //     }

  //     // message.info("checkout success you'll be redirect to midtrans payment");
  //   } catch (error) {
  //     console.log("Error checkout: ", error);
  //     ErrorHandler(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const review = `This is a Great Book!
                    text-gray-500text-gray-500text-gray-500text-gray-500text-gray-500text-gray-500text-gray-500text-gray-500text-gray-500text-gray-500text-gray-500text-gray-500text-gray-500text-gray-500text-gray-500text-gray-500     This is a Great Book!
                    text-gray-500text-gray-500text-gray-500text-gray-500text-gray-500text-gray-500text-gray-500text-gray-500text-gray-500text-gray-500text-gray-500text-gray-500text-gray-500text-gray-500text-gray-500text-gray-500`;

  const truncRev = truncateText(review, baseLength);
  const truncDesc = truncateText(book?.description as string, 2000);
  return (
    <div className="w-screen h-screen sm:w-[80%] sm:h-auto">
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

            <div className="space-y-6">
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

              <div className="flex flex-wrap gap-2">
                <Tag color="default" className="px-3 py-1">
                  {book?.categories?.categoryId}
                </Tag>

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

              <div className="bg-blue-50 p-4 rounded-lg">
                <Title level={isMobile ? 4 : 2} className="!mb-0 text-blue-600">
                  {formatPrice(book.price)}
                </Title>
              </div>

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

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  loading={loading}
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => {
                    handleAddToCart();
                  }}
                  disabled={loading}
                  className="!flex-1 h-12 !font-semibold !p-3  !text-[12px] sm:!text-sm"
                >
                  {isCart ? "Remove From Cart" : "Add to Cart"}
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

                  {/* <Button
                    type="default"
                    size="large"
                    icon={<ShareAltOutlined />}
                    onClick={handleShareClick}
                    className="h-12 px-6 !text-[12px] sm:!text-sm w-full sm:w-auto"
                  >
                    Share
                  </Button> */}
                </div>
              </div>

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

          <div className="w-full">
            <Divider orientation="left">
              <Title level={4} className="!mb-0">
                Description
              </Title>
            </Divider>
            <div className="bg-gray-50 p-2 rounded-md text-base">
              <Paragraph className="text-gray-700 text-[10px]! text-base sm:text-sm! leading-relaxed">
                <div
                  dangerouslySetInnerHTML={{
                    __html: truncDesc || "No Content",
                  }}
                />
              </Paragraph>

              {book?.description?.length! > 2000 && (
                <div className="pr-4 pb-2 flex justify-end ">
                  <p
                    onClick={() => setIsOpen(true)}
                    className="hover:text-sky-600 underline text-[12px] sm:text-sm cursor-pointer text-gray-800"
                  >
                    Read More
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 h-full">
            <h4 className="text-xl sm:text-2xl font-semibold tracking-wide">
              Book Reviews
            </h4>
            <div className="flex flex-col sm:flex-row justify-between">
              <div className="flex  items-center justify-between sm:justify-start sm:gap-3 p-2">
                <div className="flex items-baseline-last">
                  <div className="flex items-center gap-2 text-xl sm:text-2xl font-semibold">
                    <StarFilled className="!text-amber-300" />
                    <h4>5.0</h4>
                  </div>
                  <h4 className="font-normal text-sm">/5</h4>
                </div>
                <div className=" hidden sm:block p-[0px] w-[1px] h-[50px] bg-black"></div>
                <div>
                  <h4 className="text-[11px] sm:text-sm">
                    <b>3</b> Reviews
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[10px] sm:text-sm tracking-wide">
                <h4>What do you think about this book?</h4>
                <div>
                  <Button
                    onClick={() => {
                      if (!auth?.authenticated) {
                        message.info("You must login first!");
                        router.push("/auth/login");
                        return;
                      }

                      setIsModalReview(true);
                    }}
                    className="!text-[10px] !p-2 sm:!p-4 sm:!text-sm"
                  >
                    Write a Review
                  </Button>
                </div>
              </div>
            </div>
            <Divider />

            <div className="flex w-full justify-end gap-3 tracking-wide">
              <Select
                loading={loading}
                className="!w-full sm:!w-[150px] !text-[10px] sm:!text-sm"
                // value={selectOption}
                options={[
                  {
                    value: "highest_score",
                    label: "Highest Score",
                  },
                  {
                    value: "lowest_score",
                    label: "Lowest Score",
                  },
                ]}
                // onChange={(value: OptionType) => setSelectedOption(value)}
              />
              <Select
                loading={loading}
                style={{ minWidth: 125 }}
                className="!text-[10px]  sm:!text-sm"
                // value={selectOption}
                options={[
                  {
                    value: "all_score",
                    label: "All Score",
                  },
                  {
                    value: 1,
                    label: <StarLabel total_star={1} />,
                  },
                  {
                    value: 2,
                    label: <StarLabel total_star={2} />,
                  },
                  {
                    value: 3,
                    label: <StarLabel total_star={3} />,
                  },
                  {
                    value: 4,
                    label: <StarLabel total_star={4} />,
                  },
                  {
                    value: 5,
                    label: <StarLabel total_star={5} />,
                  },
                ]}
                // onChange={(value: OptionType) => setSelectedOption(value)}
              />
            </div>

            <div className="p-4">
              <div className="flex flex-col gap-7">
                {book?.reviews?.map((item) => (
                  <div key={item?.id} className="flex flex-col gap-2">
                    <div className="flex justify-between sm:flex-row flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-[40px] h-[40px] bg-gray-600 rounded-full overflow-hidden">
                          <Image
                            src={
                              item?.user?.profileImage?.imageUrl ||
                              "/images/default-account.png"
                            }
                            width={100}
                            height={100}
                            className="w-full h-full object-cover text-white"
                            alt="profile-img"
                          />
                        </div>
                        <div className="flex items-start tracking-wide flex-col">
                          <h4 className="font-semibold text-[12px] sm:text-sm">
                            {item?.user?.username}
                          </h4>
                          <p className="text-gray-500 text-[11px]">
                            {dayjs(new Date(item?.createdAt!)).format(
                              "DD - MMM - YYYY",
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <StarLabel total_star={item?.rating} />
                      </div>
                    </div>
                    <div className="relative">
                      <p className="text-gray-700  text-[10px] sm:text-sm">
                        {truncateText(item?.comment as string, baseLength)}
                      </p>

                      {item?.comment && item.comment.length > 300 && (
                        <p
                          onClick={() =>
                            setBaseLength(
                              baseLength > 300 ? 300 : item?.comment?.length!,
                            )
                          }
                          className="underline text-[12px] sm:text-sm absolute right-0 hover:text-sky-600 cursor-pointer"
                        >
                          {baseLength > 300 ? "Hide" : "Read More"}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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

      <Modal
        open={isOpen}
        closable
        onCancel={() => setIsOpen(false)}
        className="!w-[800px]"
        footer={false}
      >
        <div className="p-4">
          <div
            className="leading-6"
            dangerouslySetInnerHTML={{
              __html: (book?.description as string) || "No Content",
            }}
          />
        </div>
      </Modal>

      <Modal
        open={isModalReview}
        closable={true}
        onCancel={() => {
          (setIsModalReview(false), setRating(0));
        }}
        footer={false}
        className="sm:!w-[650px] !w-full"
      >
        <div className="sm:p-4 p-0 noselect">
          <h4 className="font-semibold text-center tracking-wide text-xl sm:text-2xl">
            Book Reviews
          </h4>

          <div className="flex gap-4 items-center justify-center sm:justify-normal flex-col my-4 sm:mt-3">
            <div>
              {book?.images && book?.images.length > 0 ? (
                <>
                  {book?.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative w-[80px] h-[120px] h sm:w-[100px] sm:h-[150px] rounded-lg overflow-hidden"
                    >
                      <Image
                        src={image?.imageUrl as string}
                        alt={
                          image?.bookId || `${book.title} - Image ${index + 1}`
                        }
                        fill
                        className="object-cover w-full h-full "
                      />
                    </div>
                  ))}
                </>
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

            <div className="tracking-wide flex items-center justify-center flex-col">
              <h4 className="text-gray-700">{book?.author || "No Content"}</h4>
              <h4 className="font-semibold text-xl">
                {book?.title || "No Content"}
              </h4>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <AppRate
              size={isMobile ? 25 : 37}
              value={rating}
              onChange={setRating}
            />
          </div>

          <div className="mt-4">
            <h4 className="text-center font-semibold text-sm sm:text-xl tracking-wide">
              What do you think about this book?
            </h4>
            <div className="mt-2">
              <Input.TextArea
                minLength={10}
                style={{
                  border: "1px solid gray",
                  padding: 10,
                  fontSize: isMobile ? 12 : 14,
                  minHeight: 150,
                }}
                onChange={(e) =>
                  setDataReview({
                    ...dataReview,
                    comment: e.target.value,
                  })
                }
                placeholder="Tell us about your experience with this book, minimum 10 characters"
              />
            </div>
          </div>

          <Button
            type="primary"
            onClick={() => handleSubmitReview(dataReview)}
            className="!w-full mt-2"
          >
            Submit
          </Button>
        </div>
      </Modal>
    </div>
  );
};

const StyledRate = styled(Rate)`
  /* STAR YANG BELUM DIPILIH */
  .ant-rate-star-zero svg {
    fill: #a9a9a9;
  }

  /* STAR YANG SUDAH DIPILIH */
  /* .ant-rate-star-full svg {
    fill: oklch(87.9% 0.169 91.605) !important;
  } */

  /* STAR SAAT HOVER */

  .ant-rate-star:active svg {
    fill: #a9a9a9;
  }
  /* .ant-rate-star-hover svg {
    fill: #a9a9a9 !important;
  } */
`;

export default BookDetailPage;
