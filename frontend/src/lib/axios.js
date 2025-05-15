import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chatlly.onrender.com/api",
  withCredentials: true,
});
