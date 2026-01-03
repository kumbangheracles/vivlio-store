"use client";

import { ArticleProperties } from "@/types/article.type";
import BlogCard from "../BlogCard";
import { Result } from "antd";
interface PropTypes {
  dataArticles?: ArticleProperties[];
}
const ArticleIndex = ({ dataArticles }: PropTypes) => {
  return (
    <div className="w-full min-h-screen">
      <div className="mt-[100px]">
        {!dataArticles ? (
          <div className="p-4 w-full h-full">
            <div className="flex items-center justify-center h-screen w-full flex-col gap-3">
              <Result
                status={404}
                className="cart-result"
                title={
                  "No articles are available at the moment. Please check back later."
                }
              />
            </div>
          </div>
        ) : (
          <>
            <h4 className="p-4 text-center font-semibold text-3xl text-sky-500 text-shadow-lg">
              VIVLIO BLOG
            </h4>
            <div className="p-4 flex flex-wrap justify-center gap-5">
              {dataArticles?.map((item) => (
                <BlogCard dataAricle={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ArticleIndex;
