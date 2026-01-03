import { ArticleProperties } from "@/types/article.type";
import DefaultImage from "../../../assets/images/default-img.png";
import Image from "next/image";
import dayjs from "dayjs";
import RichTextRenderer from "@/components/RichText";

interface PropTypes {
  dataArticle: ArticleProperties;
}

const ArticleDetail = ({ dataArticle }: PropTypes) => {
  return (
    <div className="flex justify-center items-center mt-2 sm:mt-[120px] font-mono">
      <div className="sm:w-[57%] w-full p-4">
        <h4 className="font-medium tracking-wide sm:text-2xl text-xl text-center">
          {dataArticle.title}
        </h4>

        <div className="mt-1 sm:mt-4 text-center text-gray-400">
          <p className="sm:mb-4 mb-2">
            {dayjs(dataArticle.createdAt).format(" MMMM DD YYYY") ||
              "No Content"}
          </p>
          <div className="w-full h-[300px] sm:h-[400px] overflow-hidden flex justify-center items-center">
            <Image
              src={dataArticle?.articleImages?.imageUrl || DefaultImage}
              width={100}
              height={100}
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
  );
};

export default ArticleDetail;
