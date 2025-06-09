export const isEmpty = (val?: string) =>
  !val || val.trim() === "" || val === undefined;
export const isEmptyRole = (val: number | string) => !val;
