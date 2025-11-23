export type ArticleProperties = {
  id?: string;
  title?: string;
  description?: string;
  status?: string;
  createdByAdminId?: string;
  isPopular?: boolean;
  articleImages?: any;
  createdAt?: Date;
  updateAt?: Date;
};

export type ArticleImage = {
  articleId: string;
  imageUrl: string;
  public_id: string;
};

export enum ArticleStatusType {
  PUBLISH = "PUBLISHED",
  UNPUBLISH = "UNPUBLISHED",
}

export const initialArticleValue: ArticleProperties = {
  id: "",
  title: "",
  description: "",
  status: "",
  createdByAdminId: "",
  isPopular: false,
  articleImages: [],
};
