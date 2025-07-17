// 토큰 만료 시 로그아웃 컴포넌트
import React from "react";
import { Navigate } from "react-router-dom";
import { isTokenExpired } from "../utils/auth";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("로그인 후 이용 가능합니다.");
    return <Navigate to="/login" replace />;
  }

  if (isTokenExpired(token)) {
    localStorage.removeItem("token");
    alert("세션이 만료되어 로그아웃되었습니다.");
    return <Navigate to="/login" replace />;
  }

  return children;
};


export default ProtectedRoute;
