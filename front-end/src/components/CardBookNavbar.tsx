"use client";
import { BookProps } from "@/types/books.type";
import BookDefault from "../assets/images/bookDefault.png";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { message } from "antd";
import useGlobalLoadingBar from "@/hooks/useGlobalLoadingBar";
import { useOverlayStore } from "@/zustand/useOverlay.store";

interface PropTypes {
  dataBook: BookProps;
}

const CardBookNavbar = ({ dataBook }: PropTypes) => {
  const auth = useAuth();
  const { setIsOverlay } = useOverlayStore();
  const { handlePushRoute } = useGlobalLoadingBar();
  const goToDetail = (id: string) => {
    if (!auth.accessToken) {
      message.info("You must login first!!!");
      handlePushRoute("/auth/login");
      return;
    }

    handlePushRoute(`/book/${id}`);
    setIsOverlay(false);
  };
  return (
    <div
      className="flex items-start gap-2 bg-gray-50 rounded-xl p-2 w-[230px] cursor-pointer hover:bg-gray-200 transition-all"
      onClick={() => goToDetail(dataBook?.id as string)}
      key={dataBook.id}
    >
      <div className="w-[80px] h-[100px] overflow-hidden rounded-xl shrink-0">
        <Image
          src={dataBook?.images![0]?.imageUrl || BookDefault}
          width={100}
          height={100}
          className="w-full h-full object-cover"
          alt="book-recom"
        />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <h4 className="font-normal text-[12px] text-gray-500 shrink-0">
            Title:
          </h4>
          <h4 className="text-[10px] truncate">{dataBook?.title}</h4>
        </div>

        <div className="flex items-center gap-1">
          <h4 className="font-normal text-[12px] text-gray-500 shrink-0">
            Author:
          </h4>
          <h4 className="text-[10px]">{dataBook?.author}</h4>
        </div>

        <div className="flex items-start flex-wrap">
          <div className="flex flex-wrap gap-[1.5px] items-center">
            <h4 className="font-normal text-[12px] mr-1 text-gray-500 shrink-0">
              Genre:
            </h4>
            {dataBook?.genres?.slice(0, 4).map((item, index) => (
              <h4
                key={`${item.genre_title}-${index}`}
                className="text-[10px] p-[2px] bg-white rounded-md border-gray-300 cursor-pointer hover:bg-sky-50 transition-all border"
              >
                {item?.genre_title}
              </h4>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardBookNavbar;
