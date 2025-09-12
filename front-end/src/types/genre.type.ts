export type GenreProperties = {
  genreId: string;
  genre_title: string;
  status: string;
  description: string;
  createdByAdminId: string;
};

export enum GenreStatusType {
  PUBLISH = "PUBLISHED",
  UNPUBLISH = "UNPUBLISHED",
}

export const genreInitialValue: GenreProperties = {
  genreId: "",
  genre_title: "",
  status: "",
  description: "",
  createdByAdminId: "",
};
