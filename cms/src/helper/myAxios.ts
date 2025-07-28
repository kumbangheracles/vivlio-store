import axios from "axios";
export const API_URL = import.meta.env.VITE_API_URL || "";
console.log("Api Url: ", API_URL);
const token = localStorage.getItem("accessToken");
const myAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default myAxios;
