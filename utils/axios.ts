import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

const DEFAULT_API_BASE_URL = "https://rakiestore-w04r.onrender.com";
const baseURL =
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim() || DEFAULT_API_BASE_URL;

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  console.warn(
    `[api] NEXT_PUBLIC_API_BASE_URL is not set; falling back to ${DEFAULT_API_BASE_URL}`,
  );
}

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window === "undefined") return config;
  const token = localStorage.getItem("auth_token");
  if (!token) return config;

  // Prefer Bearer auth, but also send x-access-token for backends that expect it.
  const headers = AxiosHeaders.from(config.headers ?? {});
  if (!headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("x-access-token")) headers.set("x-access-token", token);
  config.headers = headers;
  return config;
});

export default api;
