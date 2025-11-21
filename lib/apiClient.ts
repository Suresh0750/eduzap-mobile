import axios from "axios";
console.log('server url',process.env.EXPO_PUBLIC_SERVER_URL)
export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_SERVER_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});
