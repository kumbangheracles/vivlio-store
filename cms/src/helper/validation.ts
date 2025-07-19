export const isEmpty = (val?: string) =>
  !val || val.trim() === "" || val === undefined;
export const isEmptyRole = (val: number | string) => !val;
export const isBooleanUndefined = (val: boolean | null | undefined) =>
  val === null || val === undefined;
