import axios from "axios";

export const axiosInstance = axios.create({
      baseURL: "https://chatlly.onrender.com/api",
    // baseURL: "http://localhost:5000/api",
    withCredentials: true,
});
