export interface BaseMultipleResponse<T> {
  status: boolean;
  message: string;
  payload: T[]; // array data (bisa kosong)
  total?: number; // total data (optional, biasanya untuk pagination)
  page?: number; // halaman sekarang (optional)
  perPage?: number; // data per halaman (optional)
}

export interface BaseSingleResponse<T> {
  status: boolean; // success or fail
  message: string; // optional message
  payload: T | null; // data tunggal atau null
}
