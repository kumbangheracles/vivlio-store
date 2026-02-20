"use client";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import Dropdown from "antd/es/dropdown/dropdown";
import { Badge, Empty, message, Spin } from "antd";
import { styled } from "styled-components";
import { Modal } from "antd";
import { GoArrowLeft } from "react-icons/go";
import { usePathname, useRouter } from "next/navigation";
import myAxios, { API_URL } from "@/libs/myAxios";
import { ErrorHandler } from "@/helpers/handleError";
import AppInput from "./AppInput";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { CiSearch } from "react-icons/ci";
import { signOut } from "next-auth/react";
import { CloseOutlined, DownOutlined, SearchOutlined } from "@ant-design/icons";
import DropdownProfile from "./DropdownProfile";
import { UserProperties } from "@/types/user.type";
import { MdHistory, MdOutlineNavigateNext } from "react-icons/md";
import { cn } from "@/libs/cn";
import useDeviceType from "@/hooks/useDeviceType";
import { CategoryProps } from "@/types/category.types";
import { BookProps, BookStatusType } from "@/types/books.type";
import MainLogo from "../assets/main-logo.png";
import Image from "next/image";
import { GenreProperties } from "@/types/genre.type";
import useGlobalLoadingBar from "@/hooks/useGlobalLoadingBar";
import { useOverlayStore } from "@/zustand/useOverlay.store";
import {
  clearHistory,
  clearOneHistory,
  loadHistory,
  MAX,
  saveHistory,
  SearchHistory,
} from "@/libs/searchHistoryLibs";
import CardBookNavbar from "./CardBookNavbar";
import highlightText from "@/helpers/HighlightText";
import { useMounted } from "@/hooks/useMounted";
import GlobalLoading from "./GlobalLoading";
interface PropTypes {
  dataUser?: UserProperties;
  dataCategories?: CategoryProps[];
  dataCartedBooks?: BookProps[];
  dataGenres?: GenreProperties[];
  dataBooks?: BookProps[];
}

export default function Navbar({
  dataUser,
  dataCategories,
  dataCartedBooks,
  dataGenres,
  dataBooks,
}: PropTypes) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const auth = useAuth();
  const router = useRouter();
  const isMobile = useDeviceType();
  const { isOverlay, setIsOverlay, toggleOverlay, keyword, setKeyword } =
    useOverlayStore();
  const [results, setResults] = useState<BookProps[]>([]);
  const [resultDisplay, setResultDispay] = useState<ReactNode | null>(null);
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [suggestions, setSuggestions] = useState<BookProps[]>([]);
  const [isDisplayRecom, setIsDisplayRecom] = useState(false);
  const [isHover, setIshover] = useState<boolean>(false);
  const path = usePathname();
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [dropCategory, setIsDropCategory] = useState<boolean>(false);
  const params = new URLSearchParams();
  const mounted = useMounted();
  const [totalLengthCart, setTotalLengthCart] = useState<number>(0);
  const { handlePushRoute, handleReplaceRoute } = useGlobalLoadingBar();
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
      handlePushRoute("/auth/login");
      return;
    }

    handlePushRoute("/cart");
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
    handleReplaceRoute(`/category/${slug}/${categoryId}`);

    setIsDropCategory(false);
  };
  const goToGenre = (genreTitle: string, genreId: string) => {
    const slug = slugify(genreTitle);
    handleReplaceRoute(`/genre/${slug}/${genreId}`);

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
          onClick: () => handlePushRoute("/account"),
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
            handlePushRoute("/auth/login");
          },
        },
      ];

  useEffect(() => {
    setTotalLengthCart(dataCartedBooks?.length as number);
  }, [dataCartedBooks]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOverlay(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (dropCategory) {
      setIsOverlay(true);
      setIsDisplayRecom(false);
    } else {
      setIsOverlay(false);
    }

    if (isDisplayRecom) {
      setIsDropCategory(false);
      setIsOverlay(true);
    }

    if (!isOverlay) {
      setIsDisplayRecom(false);
    }
  }, [dropCategory, isDisplayRecom, isOverlay]);

  async function fetchBooksSearch(keyword: string) {
    const params = new URLSearchParams({
      title: keyword,
      status: BookStatusType.PUBLISH,
      page: "1",
      limit: "5",
    });

    let url;

    if (auth?.accessToken) {
      url = `${API_URL}/books?${params}`;
    } else {
      url = `${API_URL}/books/common-all?${params}`;
    }

    const res = await fetch(url, {
      headers: auth?.accessToken
        ? { Authorization: `Bearer ${auth?.accessToken}` }
        : {},
      cache: "no-store",
    });

    return res.json();
  }

  const addHistory = (keyword: string) => {
    if (!keyword.trim()) return loadHistory();

    const history = loadHistory();
    const filtered = history.filter((h) => h.keyword !== keyword);

    const newHistory: SearchHistory[] = [
      { id: Math.random(), keyword, searchedAt: Date.now() },
      ...filtered,
    ].slice(0, MAX);

    console.log("type newHistory: ", newHistory);

    saveHistory(newHistory);
    return newHistory;
  };

  // useEffect(() => {
  //   const history = loadHistory();
  //   console.log("History: ", history);

  //   if (history.length > 4) {
  //     history.pop();
  //   }
  // }, [loadHistory()]);

  useEffect(() => {
    if (keyword.length < 2) {
      setSuggestions([]);
      setIsloading(false);
      return;
    }

    setIsloading(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetchBooksSearch(keyword);
        setSuggestions(res.results || []);
      } finally {
        setIsloading(false);
      }
    }, 700);

    return () => {
      clearTimeout(timer);
    };
  }, [keyword]);

  const handleSearch = async (value?: string) => {
    const searchValue = value ?? keyword;
    setKeyword(searchValue);
    if (!searchValue.trim()) return;

    const res = await fetchBooksSearch(searchValue);

    params.set("key", searchValue as string);
    handleReplaceRoute(`/search-books?${params.toString()}`);
    setResults(res.results || []);

    setHistory(addHistory(searchValue));
    setIsDisplayRecom(false);
    setIsOverlay(false);
  };

  const deleteOneHistory = (id: number) => {
    clearOneHistory(id);
    setHistory(loadHistory());
  };

  useEffect(() => {
    if (results.length > 0) {
      setResultDispay(<></>);
    }
  }, [results]);

  useEffect(() => {
    if (path === "/" || path.includes("/category") || path.includes("/genre")) {
      params.set("key", "");

      setKeyword("");
    }
  }, [path]);

  return (
    <>
      {(isMobile && path === "/cart") ||
      (isMobile && path === "/account-mobile") ||
      (isMobile && path === "/account-mobile/wishlist") ||
      (isMobile && path === "/account-mobile/book-reviews") ||
      (isMobile && path === "/account-mobile/transactions") ||
      (isMobile && path === "/account-mobile/profile") ||
      path === "/payment" ? (
        <></>
      ) : (
        <nav className="fixed top-0 w-full bg-white sm:bg-[#d9eafd] shadow-sm z-[999]  transition-all">
          {/* Desktop */}
          <div className="hidden sm:flex relative flex-col justify-center items-center min-w-full">
            <div className="flex justify-between w-full items-center px-5 z-[99] bg-[#d9eafd] md:px-[20px] lg:px-[100px] py-4">
              <div
                className="font-extrabold tracking-widest text-xl logo cursor-pointer "
                onClick={() => handlePushRoute("/")}
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

              <div className=" w-full flex relative  items-center gap-3 justify-center sm:w-[50%]">
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
                    value={keyword}
                    placeholder="Search Books, Blogs, etc"
                    onFocus={() => {
                      (setIsOverlay(true), setIsDisplayRecom(true));
                    }}
                    onClick={() => {
                      (setIsOverlay(true), setIsDisplayRecom(true));
                    }}
                    onChange={(e) => {
                      (setIsOverlay(true),
                        setIsDisplayRecom(true),
                        setKeyword(e.target.value));
                    }}
                    className="w-full outline-0 border-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                  />
                  <SearchOutlined />
                </div>
                {/* Recom list */}
                <div
                  className={`
      fixed top-18 mx-auto z-[20]
      min-w-[500px] max-w-[500px] h-auto
      bg-white rounded-xl p-4 shadow-2xl
      transition-all duration-200
      ${cn(
        isDisplayRecom
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2 pointer-events-none",
      )}
    `}
                >
                  {/* Autocomplete */}
                  {isLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Spin />
                    </div>
                  ) : (
                    <>
                      {keyword.length > 0 && (
                        <div className="mt-2">
                          {suggestions.length > 0 ? (
                            suggestions.map((book) => (
                              <div
                                key={book.id}
                                className="px-4 py-2 hover:bg-gray-100 rounded-xl cursor-pointer flex items-center gap-5 mb-2"
                                onClick={() => handleSearch(book.title)}
                              >
                                <CiSearch />
                                <div>{highlightText(book.title, keyword)}</div>
                              </div>
                            ))
                          ) : (
                            <div className="py-6">
                              <Empty description="Not Found" />
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* History */}
                  {keyword.length === 0 && history.length > 0 && (
                    <div className="mb-4 relative">
                      <div className="flex justify-between items-center">
                        <h4 className=" font-semibold tracking-wide text-xl">
                          Search History
                        </h4>
                        <h4
                          className="font-medium cursor-pointer underline text-sm tracking-wide"
                          onClick={() => {
                            (clearHistory(), setHistory([]));
                          }}
                        >
                          Clear History
                        </h4>
                      </div>
                      {history.map((h, i) => (
                        <div
                          key={i}
                          className="px-4 py-2 hover:bg-gray-100 rounded-xl flex items-center justify-between cursor-pointer"
                          onClick={() => handleSearch(h.keyword)}
                        >
                          <div className="flex items-center gap-5">
                            <MdHistory /> <h4>{h.keyword}</h4>
                          </div>

                          <CloseOutlined
                            onClick={(e) => {
                              (clearOneHistory(h.id),
                                deleteOneHistory(h.id),
                                e.stopPropagation());
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <h4 className="font-semibold tracking-wide text-xl">
                    Recomended Books
                  </h4>

                  <div className="flex mt-2 gap-2 justify-between flex-wrap">
                    {(dataBooks?.length as number) > 0 ? (
                      <>
                        {dataBooks?.map((item) => (
                          <CardBookNavbar dataBook={item} key={item.id} />
                        ))}
                      </>
                    ) : (
                      <div className="flex items-center justify-center w-full">
                        <Empty description={"No Recomended Books Availble"} />
                      </div>
                    )}
                  </div>
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
              )}   base-blue shadow-2xl p-4 fixed top-1 !z-30 w-full sm:w-[750px] transition-all duration-400 rounded-xl overflow-hidden`}
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
          <div
            className={`sm:hidden flex justify-between items-center ${cn(isMobile && path === "/search-books-mobile" ? "px-2" : "px-5")} w-full md:px-[100px] py-3`}
          >
            {/* Logo */}

            {isMobile && path === "/search-books-mobile" && (
              <GoArrowLeft
                size={25}
                className="mx-1"
                onClick={() => router.back()}
              />
            )}
            <div
              className={`input-search-navbar w-full sm:w-[70%] ${cn(isMobile && path === "/search-books-mobile" ? "mr-0" : "mr-4")}`}
            >
              <AppInput
                prefix={<SearchOutlined />}
                placeholder="Search Books, Blogs, etc"
                style={{
                  width: "100%",
                  height: "35px",
                  borderRadius: 15,
                  letterSpacing: 1,
                }}
                onChange={(e) => {
                  (setIsDisplayRecom(true), setKeyword(e.target.value));
                }}
                onClick={() => {
                  if (path === "/search-books-mobile") return;
                  handlePushRoute("/search-books-mobile");
                }}
                className="w-full outline-0 border-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
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
                      {mounted ? (
                        <img
                          className="object-cover w-full h-full"
                          src={
                            auth?.authenticated
                              ? dataUser?.profileImage?.imageUrl
                              : "/icons/account.svg"
                          }
                          alt="account-icon"
                        />
                      ) : (
                        <GlobalLoading />
                      )}
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

            {isMobile && path !== "/search-books-mobile" && (
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
