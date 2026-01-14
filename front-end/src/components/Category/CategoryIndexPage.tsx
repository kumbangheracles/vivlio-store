"use client";
import { CategoryProps } from "@/types/category.types";
import ListCategory from "../Home/components/ListCategory";
import NotFoundPage from "../NotFoundPage";
import useDeviceType from "@/hooks/useDeviceType";
interface PropTypes {
  dataCategories: CategoryProps[];
}
const CategoryIndexPage = ({ dataCategories }: PropTypes) => {
  const isMobile = useDeviceType();
  return (
    <>
      {!isMobile ? (
        <NotFoundPage />
      ) : (
        <div>
          <ListCategory isDisplayAll={true} dataCategories={dataCategories} />
        </div>
      )}
    </>
  );
};

export default CategoryIndexPage;
