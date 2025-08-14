export type CategoryProps = {
  categoryId: string;
  name: string;
  description?: string;
  isPopular?: boolean;
  status?: boolean | null;
  createdAt: Date;
  updatedAt: Date;
};

export const initialCategoryValue: CategoryProps = {
  categoryId: "",
  name: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  status: null,
};
