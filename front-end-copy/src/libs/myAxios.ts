import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

const myAxios = axios.create({
  baseURL: process.env.API_BASE_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request Interceptor
myAxios.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const session = await getSession();

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
      console.log("✅ Added Bearer token to request");
      console.log("token: ", session.accessToken);
    } else {
      console.log("⚠️ No access token found in session");
    }

    return config;
  },
  (error: AxiosError) => {
    console.log("🚨 Request error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
myAxios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.log("🚨 Response error:", error.response?.data || error.message);

    switch (error.response?.status) {
      case 401:
        console.log("🔒 Unauthorized access");
        break;
      case 403:
        console.log("⛔ Forbidden access");
        break;
      case 500:
        console.log("💥 Server error");
        break;
    }

    return Promise.reject(error);
  }
);

export default myAxios;
