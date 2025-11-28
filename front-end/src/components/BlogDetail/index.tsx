import { ArticleProperties } from "@/types/article.type";
import DefaultImage from "../../assets/images/default-img.png";
import Image from "next/image";
import dayjs from "dayjs";
import RichTextRenderer from "../RichText";
interface PropTypes {
  dataArticle: ArticleProperties;
}

const ArticleDetail = ({ dataArticle }: PropTypes) => {
  return (
    <div className="flex justify-center items-center mt-[120px] font-mono">
      <div className="w-[57%] p-4">
        <h4 className="font-medium tracking-wide text-2xl text-center">
          {dataArticle.title}
        </h4>

        <div className="mt-4 text-center text-gray-400">
          <span className="!mb-4">
            {dayjs(dataArticle.createdAt).format(" MMMM DD YYYY") ||
              "No Content"}
          </span>
          <div className="w-full h-[400px] overflow-hidden flex justify-center items-center">
            <Image
              src={dataArticle?.articleImages?.imageUrl || DefaultImage}
              width={100}
              height={100}
              alt="article-detail-image"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="mt-4">
          <RichTextRenderer html={dataArticle?.description as string} />
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
