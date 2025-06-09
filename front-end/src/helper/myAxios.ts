import axios, { Axios, type AxiosInstance } from "axios";

export const myAxios: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});
