import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Attach access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-refresh access token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh-token/")
    ) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(
          `${BASE_URL}/refresh-token/`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshRes.data.access;
        localStorage.setItem("accessToken", newAccessToken);

        axiosInstance.defaults.headers.common.Authorization =
          `Bearer ${newAccessToken}`;

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch {
        localStorage.removeItem("accessToken");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
