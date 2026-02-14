"use client";

import CardBookNavbar from "@/components/CardBookNavbar";
import NotFoundPage from "@/components/NotFoundPage";
import highlightText from "@/helpers/HighlightText";
import { useAuth } from "@/hooks/useAuth";
import useDeviceType from "@/hooks/useDeviceType";
import useGlobalLoadingBar from "@/hooks/useGlobalLoadingBar";
import { API_URL } from "@/libs/myAxios";
import {
  clearHistory,
  clearOneHistory,
  loadHistory,
  MAX,
  saveHistory,
  SearchHistory,
} from "@/libs/searchHistoryLibs";
import { BookProps, BookStatusType } from "@/types/books.type";
import { useOverlayStore } from "@/zustand/useOverlay.store";
import { CloseOutlined } from "@ant-design/icons";
import { Empty, Spin } from "antd";
import { ReactNode, useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { MdHistory } from "react-icons/md";

interface PropTypes {
  dataBooks?: BookProps[];
}
const SearchBookMobileIndex = ({ dataBooks }: PropTypes) => {
  const [results, setResults] = useState<BookProps[]>([]);
  const [resultDisplay, setResultDispay] = useState<ReactNode | null>(null);
  const { keyword, setKeyword } = useOverlayStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [suggestions, setSuggestions] = useState<BookProps[]>([]);
  const { handlePushRoute, handleReplaceRoute } = useGlobalLoadingBar();
  const [isDisplayRecom, setIsDisplayRecom] = useState(false);
  const params = new URLSearchParams();
  const auth = useAuth();
  const isMobile = useDeviceType();
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
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetchBooksSearch(keyword);
        setSuggestions(res.results || []);
      } finally {
        setIsLoading(false);
      }
    }, 700);

    return () => {
      clearTimeout(timer);
    };
  }, [keyword]);

  const handleSearch = async (value?: string) => {
    const searchValue = value ?? keyword;
    if (!searchValue.trim()) return;

    const res = await fetchBooksSearch(searchValue);

    params.set("key", searchValue as string);
    handleReplaceRoute(`/search-books?${params.toString()}`);
    setResults(res.results || []);

    setHistory(addHistory(searchValue));
    setIsDisplayRecom(false);
  };

  const deleteOneHistory = (id: number) => {
    clearOneHistory(id);
    setHistory(loadHistory());
  };

  // useEffect(() => {
  //   if (results.length > 0) {
  //     setResultDispay(<></>);
  //   }
  // }, [results]);

  if (!isMobile) {
    return <NotFoundPage />;
  }

  return (
    <div className=" w-full min-h-screen mt-[-20px]">
      <h4 className="tracking-wide font-semibold mb-[-10px] pt-4 px-4">
        Recomended Books
      </h4>
      <div className="mt-3">
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
                      className="px-4 py-2  hover:bg-gray-100 rounded-xl cursor-pointer flex items-center gap-5 mb-2"
                      onClick={() => handleSearch(book.title)}
                    >
                      <CiSearch />
                      <div className="text-[10px]">
                        {highlightText(book.title, keyword)}
                      </div>
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
      </div>
      <div className="flex gap-2 p-4 justify-between flex-wrap">
        {dataBooks?.map((item) => (
          <CardBookNavbar dataBook={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};
export default SearchBookMobileIndex;
