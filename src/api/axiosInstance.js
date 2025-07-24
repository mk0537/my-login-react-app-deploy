import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 토큰 자동 삽입
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 - 401 처리
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const isUnauthorized = error.response && error.response.status === 401;
    const isOnLoginPage = window.location.pathname === "/login";

    if (isUnauthorized && !isOnLoginPage) {
      alert("로그인 유효 시간이 만료되어 자동 로그아웃 되었습니다.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
