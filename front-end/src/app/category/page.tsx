import { Metadata } from "next";

import CategoryIndexPage from "@/components/Category/CategoryIndexPage";
import fetchCategory from "../actions/fetchCategory";
export const metadata: Metadata = {
  title: `ViviBook - All Category`,
  description: "All Category",
};

const CategoryIndex = async () => {
  const dataCategories = await fetchCategory();
  return (
    <>
      <CategoryIndexPage dataCategories={dataCategories} />
    </>
  );
};

export default CategoryIndex;
