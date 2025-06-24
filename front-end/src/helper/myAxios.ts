// helper/myAxios.ts
import axios from "axios";

const myAxios = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// myAxios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

export default myAxios;
