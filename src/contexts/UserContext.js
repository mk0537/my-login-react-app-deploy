import React, { createContext, useContext, useState, useEffect } from 'react';

// 1) Context 생성
export const UserContext = createContext(null);

// 2) Provider 컴포넌트
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 앱 최초 실행 시 localStorage에서 로그인 정보 불러오기
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const nickName = localStorage.getItem("nickName");
    const name = localStorage.getItem("name");

    if (token && email && nickName) {
      setUser({ token, email, nickName, name });
    }
  }, []);

  // 로그인 시 호출할 수 있는 예시 함수
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token); // 필요 시 토큰도 따로 저장
  };

  // 로그아웃 시 호출할 수 있는 예시 함수
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// 3) Custom Hook (사용을 쉽게)
export const useUser = () => useContext(UserContext);
