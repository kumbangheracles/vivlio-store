import { BookImage } from "../types/books.type";

export const isEmpty = (val?: string) =>
  !val || val.trim() === "" || val === undefined;
export const isEmptyRole = (val: number | string) => !val;
export const isBooleanUndefined = (val: boolean | null | undefined) =>
  val === null || val === undefined;
export const isEmptyArray = (val: any): boolean => {
  return !Array.isArray(val) || val.length === 0;
};

export const isValidBookImageArray = (images?: BookImage[]): boolean => {
  if (!images) return true;
  if (!Array.isArray(images)) return false;
  return images.every(
    (img) =>
      typeof img.bookId === "string" &&
      img.bookId.trim() !== "" &&
      typeof img.imageUrl === "string" &&
      img.imageUrl.trim() !== "",
  );
};

export const isValidNumber = (val: unknown): boolean => {
  return typeof val === "number" && Number.isFinite(val);
};

export const isValidInteger = (val: any): boolean => {
  return (
    typeof val === "number" && Number.isInteger(val) && Number.isFinite(val)
  );
};

export const anyFieldsValid = (data?: any): boolean => {
  return Object.values(data).some(
    (value) => value === undefined || value === null || value === "",
  );
};
