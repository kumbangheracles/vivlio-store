export type GenreProperties = {
  genreid: string;
  genreId?: string;
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
  genreid: "",
  genre_title: "",
  status: "",
  description: "",
  createdByAdminId: "",
};
