"use client";
import React, { useEffect, useState } from "react";
import Dropdown from "antd/es/dropdown/dropdown";
import { Badge, Button, message } from "antd";
import { styled } from "styled-components";
import { Modal } from "antd";
import { usePathname, useRouter } from "next/navigation";
import myAxios from "@/libs/myAxios";
import { ErrorHandler } from "@/helpers/handleError";
import AppInput from "./AppInput";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "next-auth/react";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import DropdownProfile from "./DropdownProfile";
import { UserProperties } from "@/types/user.type";
import { MdOutlineNavigateNext } from "react-icons/md";
import { cn } from "@/libs/cn";
import useDeviceType from "@/hooks/useDeviceType";
import { CategoryProps } from "@/types/category.types";
import { BookProps } from "@/types/books.type";
import MainLogo from "../assets/main-logo.png";
import Image from "next/image";
import { GenreProperties } from "@/types/genre.type";
interface PropTypes {
  dataUser?: UserProperties;
  dataCategories?: CategoryProps[];
  dataCartedBooks?: BookProps[];
  dataGenres?: GenreProperties[];
}

export default function Navbar({
  dataUser,
  dataCategories,
  dataCartedBooks,
  dataGenres,
}: PropTypes) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const auth = useAuth();
  const router = useRouter();
  const isMobile = useDeviceType();
  const [isHover, setIshover] = useState<boolean>(false);
  const path = usePathname();
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [dropCategory, setIsDropCategory] = useState<boolean>(false);
  const [totalLengthCart, setTotalLengthCart] = useState<number>(0);
  const handleLogout = async () => {
    try {
      setIsloading(true);
      await myAxios.post("/auth/logout");
      message.info("Logout Success");
      await signOut({
        callbackUrl: "/auth/login",
      });
    } catch (error) {
      console.log("Error Logout: ", error);
      ErrorHandler(error);
      await signOut({
        callbackUrl: "/auth/login",
      });
    } finally {
      setIsloading(false);
    }
  };

  // console.log("Auth: ", auth);

  const goToCart = () => {
    if (auth.loading) return;
    if (!auth.accessToken) {
      message.info("You must login first!!!");
      router.push("/auth/login");
      return;
    }

    router.push("/cart");
  };

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const goToCategory = (categoryName: string, categoryId: string) => {
    const slug = slugify(categoryName);
    router.push(`/category/${slug}/${categoryId}`);

    setIsDropCategory(false);
  };
  const goToGenre = (genreTitle: string, genreId: string) => {
    const slug = slugify(genreTitle);
    router.push(`/genre/${slug}/${genreId}`);

    setIsDropCategory(false);
  };

  const items = auth.authenticated
    ? [
        {
          label: <DropdownProfile dataUser={dataUser} />,
          key: "header",
          disabled: true,
          className: "dropdown-header-nav",
        },
        {
          key: "account",
          label: (
            <StyledLabel>
              <span>Account</span>
              <MdOutlineNavigateNext />
            </StyledLabel>
          ),
          onClick: () => router.push("/account"),
        },
        {
          key: "logout",
          label: (
            <StyledLabel>
              <span>Logout</span>
              <MdOutlineNavigateNext />
            </StyledLabel>
          ),
          onClick: () => {
            setIsOpen(true);
          },
        },
      ]
    : [
        {
          key: "login",
          label: (
            <StyledLabel>
              <span>Login</span>
              <MdOutlineNavigateNext />
            </StyledLabel>
          ),
          onClick: () => {
            router.push("/auth/login");
          },
        },
      ];

  useEffect(() => {
    setTotalLengthCart(dataCartedBooks?.length as number);
  }, [dataCartedBooks]);

  return (
    <>
      {(isMobile && path === "/cart") ||
      (isMobile && path === "/account") ||
      (isMobile && path === "/account/wishlist") ||
      (isMobile && path === "/account/book-reviews") ? (
        <></>
      ) : (
        <nav className="fixed top-0 w-full bg-white sm:bg-[#d9eafd] shadow-sm z-[999]  transition-all">
          {/* Desktop */}
          <div className="hidden sm:flex relative flex-col justify-center items-center min-w-full">
            <div className="flex justify-between w-full items-center px-5 z-[99] bg-[#d9eafd] md:px-[20px] lg:px-[100px] py-4">
              <div
                className="font-extrabold tracking-widest text-xl logo cursor-pointer "
                onClick={() => router.push("/")}
              >
                <div className="flex items-center gap-3">
                  <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center overflow-hidden">
                    <Image
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                      src={MainLogo}
                      alt="main-logo"
                    />
                  </div>
                  <h4 className="text-xl font-bold tracking-wide text-gray-600">
                    ViviBook
                  </h4>
                </div>
              </div>

              <div className=" w-full flex  items-center gap-3 justify-center sm:w-[50%]">
                <div
                  onClick={() => setIsDropCategory((prev) => !prev)}
                  className="cursor-pointer bg-white border border-white px-3 py-2 rounded-[50px]"
                >
                  <div className="flex gap-3 items-center noselect font-semibold">
                    <DownOutlined
                      className={`text-sm ${cn(
                        !dropCategory ? "rotate-[0deg]" : "rotate-[180deg]",
                      )} transition-all duration-400`}
                    />
                    <h4 className="text-[13px] tracking-wide">Filter</h4>
                  </div>
                </div>

                <div className="flex gap-3 py-3 px-6 w-full bg-white rounded-[50px] border-white border">
                  <input
                    placeholder="Search Books, Blogs, etc"
                    className="w-full outline-0 border-none"
                  />
                  <SearchOutlined />
                </div>
              </div>

              <div className="hidden md:flex justify-around items-center gap-5">
                <div
                  onMouseEnter={() => setIshover(true)}
                  onMouseLeave={() => setIshover(false)}
                >
                  <Dropdown trigger={["click"]} menu={{ items }}>
                    <AccountIcon
                      isTriggered={isHover}
                      isAuth={auth?.authenticated}
                    >
                      <div
                        className={` ${
                          auth?.accessToken
                            ? "w-[30px] h-[30px]"
                            : "w-[25px] h-[25px]"
                        }  overflow-hidden! rounded-full flex items-center justify-center cursor-pointer`}
                      >
                        <img
                          className="object-cover w-full h-full"
                          src={
                            auth?.authenticated
                              ? (dataUser?.profileImage?.imageUrl ??
                                "/icons/account.svg")
                              : "/icons/account.svg"
                          }
                          alt="account-icon"
                        />
                      </div>
                    </AccountIcon>
                  </Dropdown>
                </div>

                {/* Cart */}
                <div
                  className="flex items-center justify-center w-[30px] h-[30px] cursor-pointer border rounded-full p-1 border-white hover:border-black transition-all"
                  onClick={() => goToCart()}
                >
                  <Badge count={totalLengthCart} size="small">
                    <img
                      className="w-full h-full object-cover"
                      src="/icons/chart.svg"
                      alt="chart-icon"
                    />
                  </Badge>
                </div>
              </div>

              {isMobile && (
                <div
                  className="flex items-center justify-center w-[30px] h-[30px] cursor-pointer border rounded-full p-1 border-white hover:border-black transition-all"
                  onClick={() => goToCart()}
                >
                  <img
                    className="w-full h-full object-cover"
                    src="/icons/chart.svg"
                    alt="chart-icon"
                  />
                </div>
              )}
            </div>
            {/* Dropdown Category Desktop */}
            <div
              className={` ${cn(
                dropCategory ? "max-h-[500px]" : "max-h-[0px]",
              )}   base-blue shadow-2xl p-4 fixed top-1 z-[-10] w-full sm:w-[750px] transition-all duration-400 rounded-xl overflow-hidden`}
            >
              <div
                className="flex gap-5 mt-[70px]
"
              >
                <div>
                  <h4 className="px-2 pb-4 tracking-wide font-semibold">
                    Category
                  </h4>
                  <div className=" flex gap-3 flex-wrap h-ful overflow-y-scroll scrollbar-hide">
                    {dataCategories?.map((item, index) => (
                      <div
                        className="text-gray-800 hover:bg-gray-200 transition-all cursor-pointer px-4 py-2 rounded-2xl bg-gray-100 max-w-auto"
                        key={index}
                        onClick={() =>
                          goToCategory(item?.name, item?.categoryId)
                        }
                      >
                        {item.name}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="px-2 pb-4 tracking-wide font-semibold">
                    Genre
                  </h4>
                  <div className=" flex gap-3 flex-wrap h-ful overflow-y-scroll scrollbar-hide">
                    {dataGenres?.map((item, index) => (
                      <div
                        className="text-gray-800 hover:bg-gray-200 transition-all cursor-pointer px-4 py-2 rounded-2xl bg-gray-100 max-w-auto"
                        key={index}
                        onClick={() =>
                          goToGenre(item?.genre_title, item?.genreId as string)
                        }
                      >
                        {item.genre_title}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className=" sm:hidden flex justify-between items-center px-5 md:px-[100px] py-3">
            {/* Logo */}

            <div className="input-search-navbar w-full sm:w-[70%] mr-4">
              <AppInput
                prefix={<SearchOutlined />}
                placeholder="Search Books, Blogs, etc"
                style={{
                  width: "100%",
                  height: "35px",
                  borderRadius: 15,
                  letterSpacing: 1,
                }}
              />
            </div>
            {/* Desktop Menu */}

            <div className="hidden md:flex justify-around items-center gap-5">
              {/* Search */}

              {/* Account */}
              <div
                onMouseEnter={() => setIshover(true)}
                onMouseLeave={() => setIshover(false)}
              >
                <Dropdown trigger={["click"]} menu={{ items }}>
                  <AccountIcon
                    isTriggered={isHover}
                    isAuth={auth?.authenticated}
                  >
                    <div
                      className={` ${
                        auth?.accessToken
                          ? "w-[30px] h-[30px]"
                          : "w-[25px] h-[25px]"
                      }  overflow-hidden! rounded-full flex items-center justify-center cursor-pointer`}
                    >
                      <img
                        className="object-cover w-full h-full"
                        src={
                          auth?.authenticated
                            ? dataUser?.profileImage?.imageUrl
                            : "/icons/account.svg"
                        }
                        alt="account-icon"
                      />
                    </div>
                  </AccountIcon>
                </Dropdown>
              </div>

              {/* Cart */}
              <div
                className="flex items-center justify-center w-[30px] h-[30px] cursor-pointer border rounded-full p-1 border-white hover:border-black transition-all"
                onClick={() => goToCart()}
              >
                <Badge count={totalLengthCart} size="small">
                  <img
                    className="w-full h-full object-cover"
                    src="/icons/chart.svg"
                    alt="chart-icon"
                  />
                </Badge>
              </div>
            </div>

            {isMobile && (
              <div
                className="flex items-center justify-center w-[30px] h-[30px] cursor-pointer border rounded-full p-1 border-white hover:border-black transition-all"
                onClick={() => goToCart()}
              >
                <Badge count={totalLengthCart} size="small">
                  <img
                    className="w-full h-full object-cover"
                    src="/icons/chart.svg"
                    alt="chart-icon"
                  />
                </Badge>
              </div>
            )}
          </div>

          {/* Logout Modal */}
          <Modal
            open={isOpen}
            okText="Yes"
            cancelText="Cancel"
            onCancel={() => setIsOpen(false)}
            onOk={handleLogout}
            confirmLoading={isLoading}
            title={<h1 className="text-center font-bold">Logout</h1>}
            centered
          >
            <div className="text-center">
              <h1>Are you sure you want to logout?</h1>
            </div>
          </Modal>
        </nav>
      )}
    </>
  );
}

const BottomNavbar = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px;
  font-size: 12px;
  --tw-tracking: var(--tracking-widest);
  letter-spacing: var(--tracking-widest);
  justify-content: space-around;
  background-color: #d9eafd;
  font-weight: 700;
  text-decoration: none;
  font-family: "Poppins", sans-serif;
  width: 100%;
  li {
    text-decoration: none;
    list-style: none;
    position: relative;
  }
`;

interface linkProps {
  isBlue?: boolean;
}

const StyledLink = styled(Link)<linkProps>`
  &:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    height: 2px;
    width: 0;
    background-color: black;
    transition: all 0.3s ease;
  }

  &:hover&:after {
    width: 100%;
  }

  @media (max-width: 768px) {
    background-color: ${({ isBlue }) => (isBlue ? "#d9eafd" : "white")};
    font-size: small;
    width: 100%;
    text-align: center;
    padding: 7px;
    transition: all 0.3s ease;
    &:hover&:after {
      width: 0;
    }

    &:hover {
      background-color: #d9eafd;
    }
  }
`;

interface IconProps {
  isTriggered?: boolean;
  isAuth?: boolean;
}

const AccountIcon = styled.div<IconProps>`
  height: 34px;
  width: 34px;
  cursor: pointer;
  border: 1px solid;
  border-color: ${({ isTriggered }) => (isTriggered ? "black" : "white")};
  border-radius: 50%;
  padding: ${({ isAuth }) => (isAuth ? "0" : "3px")};
  display: flex;
  /* margin-top: 10px; */
  align-items: center;
  justify-content: center;
  transition: 0.3s all ease;
  &:hover {
    border-color: black;
  }

  z-index: 99999999999999999;

  /* @media (max-width: 768px) {
    
  } */
`;

const StyledLabel = styled.h4`
  span {
    padding: 8px;
    font-weight: normal;
    font-size: 16px;
  }

  display: flex;
  justify-content: space-between;
  align-items: center;
`;
