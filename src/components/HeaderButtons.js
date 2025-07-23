import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const HeaderButtons = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(UserContext);

  
  console.log("HeaderButtons user:", user);

  // 로그인, 회원가입 페이지에서는 숨김
  const hideHeader = ["/login", "/signup"].includes(location.pathname);
  if (hideHeader) return null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("nickName");
    setUser(null); // context 상태 초기화
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  return (
    <div>
      <div className="auth-buttons">
        {user ? (
          <>
            <span style={{ marginRight: "12px" }}>
              환영합니다. <strong>{user.nickName}</strong>님!
            </span>
            <button className="postListPage-btn2" onClick={handleLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <button
            className="postListPage-btn2"
            onClick={() => navigate("/login")}
          >
            로그인
          </button>
        )}
      </div>
    </div>
  );
};

export default HeaderButtons;
