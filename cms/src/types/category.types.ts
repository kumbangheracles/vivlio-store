export type CategoryProps = {
  categoryId: string;
  name: string;
  description?: string;
  categoryImage?: CategoryImage;
  isPopular?: boolean;
  status?: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  isSuggested?: boolean;
};

export const initialCategoryValue: CategoryProps = {
  categoryId: "",
  name: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  status: null,
};

export type CategoryImage = {
  categoryId: string;
  imageUrl: string;
  public_id: string;
};
