import axios, { Axios, type AxiosInstance } from "axios";

const myAxios: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export default myAxios;
