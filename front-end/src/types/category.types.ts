export type CategoryProps = {
  categoryId: string;
  name: string;
  description?: string;
  categoryImage?: categoryImage;
  isPopular?: boolean;
  status?: boolean | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CategoryParams = {
  status?: boolean;
};

export const initialCategoryValue: CategoryProps = {
  categoryId: "",
  name: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  status: null,
};

export type categoryImage = {
  bookId?: string;
  imageUrl?: string;
  public_id?: string;
};
