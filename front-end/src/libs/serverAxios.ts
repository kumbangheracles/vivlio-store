import axios from "axios";

interface PropTypesAxios {
  token?: string;
  isConsole?: boolean;
}
export const createServerAxios = ({
  token,
  isConsole = false,
}: PropTypesAxios) => {
  const instance = axios.create({
    baseURL: process.env.API_BASE_URL || "http://localhost:3000",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    timeout: 30000,
  });

  if (isConsole === true) {
    instance.interceptors.request.use(
      (config) => {
        console.log(" Server Request:", {
          url: config.url,
          method: config.method,
          hasToken: !!config.headers.Authorization,
        });
        return config;
      },
      (error) => {
        console.error(" Server Request Error:", error);
        return Promise.reject(error);
      },
    );

    instance.interceptors.response.use(
      (response) => {
        console.log(" Server Response:", {
          url: response.config.url,
          status: response.status,
        });
        return response;
      },
      (error) => {
        console.error(" Server Response Error:", {
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data,
        });
        return Promise.reject(error);
      },
    );
  }

  return instance;
};
