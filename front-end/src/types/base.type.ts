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

export type ConfigState = {
  sidebarCollapsed: boolean;
  counterBatch: number;
};

export interface BaseResponseProps<T> {
  code: string;
  message: string;
  payload: T;
}

export interface BaseResponsePropsNoPayload {
  code: string;
  message: string;
}

export interface UploadResponseProps {
  code: string;
  message: string;
}

export interface BaseResponsePaginationProps<T> {
  code: string;
  message: string;
  payload: {
    count: number;
    prev: string;
    next: string;
    results: Array<T>;
  };
}

export interface DefaultQuery {
  limit?: number;
  offset?: number;
}

export const initialConfig: ConfigState = {
  sidebarCollapsed: false,
  counterBatch: 0,
};
