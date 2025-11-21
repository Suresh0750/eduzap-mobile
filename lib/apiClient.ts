import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_SERVER_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});
