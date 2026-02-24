"use client";
import { ArticleProperties } from "@/types/article.type";
import DefaultImage from "../../../assets/images/default-img.png";
import Image from "next/image";
import dayjs from "dayjs";
import RichTextRenderer from "@/components/RichText";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface PropTypes {
  dataArticle: ArticleProperties;
}

const ArticleDetail = ({ dataArticle }: PropTypes) => {
  const { back } = useRouter();
  return (
    <>
      <div className="fixed sm:hidden top-0 bg-white shadow-sm justify-between flex w-full px-3 py-4 z-[30]">
        <div className="flex items-center gap-2">
          <ArrowLeftOutlined onClick={() => back()} />
          <h4 className="text-sm font-bold tracking-wide">Blog Detail</h4>
        </div>
      </div>
      <div className="flex justify-center items-center mt-2 sm:mt-[120px] font-mono">
        <div className="lg:w-[60%] w-full md:w-full p-4">
          <h4 className="font-medium tracking-wide sm:text-2xl text-xl text-center">
            {dataArticle?.title}
          </h4>

          <div className="mt-1 sm:mt-4 text-center text-gray-400">
            <p className="sm:mb-4 mb-2">
              {dayjs(dataArticle?.createdAt).format(" MMMM DD YYYY") ||
                "No Content"}
            </p>
            <div className="w-full h-[300px] sm:h-[400px] overflow-hidden flex justify-center items-center">
              <Image
                src={dataArticle?.articleImages?.imageUrl || DefaultImage}
                width={1000}
                height={1000}
                alt="article-detail-image"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="sm:mt-6 mt-3 sm:text-base text-sm">
            <RichTextRenderer html={dataArticle?.description as string} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleDetail;
