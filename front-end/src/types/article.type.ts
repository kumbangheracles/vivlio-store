export enum ArticleStatusType {
  PUBLISH = "PUBLISHED",
  UNPUBLISH = "UNPUBLISHED",
}

export type ArticleProperties = {
  id?: string;
  title?: string;
  description?: string;
  status?: ArticleStatusType;
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

export const initialArticleValue: ArticleProperties = {
  id: "",
  title: "",
  description: "",
  status: undefined,
  createdByAdminId: "",
  isPopular: false,
  articleImages: [],
};
