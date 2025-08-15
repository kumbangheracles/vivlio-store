import axios, { AxiosError } from "axios";

const myAxios = axios.create({
  baseURL: process.env.API_BASE_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

myAxios.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to:`,
      config.url
    );
    return config;
  },
  (error: AxiosError) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

myAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    console.error("Response error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      console.error("Unauthorized access");
    } else if (error.response?.status === 403) {
      console.error("Forbidden access");
    } else if (error.response?.status === 500) {
      console.error("Server error");
    }

    return Promise.reject(error);
  }
);

export default myAxios;
