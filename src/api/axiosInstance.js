import axios from "axios";

// npm start 실행 시엔 .env.development 가 읽히고, npm run build 후 배포하면 .env.production 이 적용됨
const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      alert("로그인 유효 시간이 만료되어 자동 로그아웃 되었습니다.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

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

export default axiosInstance;
