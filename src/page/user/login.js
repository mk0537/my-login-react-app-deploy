import React, { useState, useEffect, useContext } from "react";
import "../../css/styles.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../../contexts/UserContext'; 

const Login = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      alert("이미 로그인된 상태입니다.");
      navigate("/posts");
    }
  }, [navigate]);

  const onInputChangeName = (e) => {
    setId(e.target.value);
  };

  const onInputChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const onButtonClick = async (e) => {
    e.preventDefault();

    if (!id.trim() || !password.trim()) {
      alert("아이디와 비밀번호를 모두 입력하세요.");
      return;
    }

    try {
      const response = await fetch("http://54.89.157.164/login/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: id,
          password: password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          alert("비밀번호가 일치하지 않습니다.");
        } else if (response.status === 404) {
          alert("존재하지 않는 계정입니다.");
        } else {
          alert("로그인 실패: " + (result.message || "알 수 없는 오류"));
        }
        return;
      }

      // localStorage 저장
      localStorage.setItem("email", result.email);
      localStorage.setItem("token", result.token);
      localStorage.setItem("name", result.name);
      localStorage.setItem("nickName", result.nickName);

      // Context에도 반영
      setUser({
        email: result.email,
        nickName: result.nickName,
        name: result.name,
        id: result.id,
        token: result.token,
      });

      alert("로그인 성공");
      navigate("/");
    } catch (error) {
      console.error("로그인 요청 중 오류:", error);
      alert("서버와의 통신 중 오류가 발생했습니다.");
    }
  };

  const _signupOnclick = () => {
    navigate("/signup");
  };

  const _onGetByEmail = () => {
    navigate("/find-email");
  };

  const _onGetByPassword = () => {
     navigate("/temp-password");
    // alert("아직 구현되지 않았습니다.")
    // return;
  };

  return (
    <div className="container">
      <div className="login-container">
        <h2>로그인</h2>
        <form onSubmit={onButtonClick}>
          <div className="form-group">
            <label htmlFor="id">아이디(이메일)</label>
            <input
              type="text"
              id="id"
              value={id}
              onChange={onInputChangeName}
              placeholder="이메일을 입력하세요."
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={onInputChangePassword}
              placeholder="비밀번호를 입력하세요."
              autoComplete="current-password"
            />
          </div>
          <div className="button-group">
            <button type="submit" className="login-btn">
              로그인
            </button>
            <button
              type="button"
              className="signup-btn"
              onClick={_signupOnclick}
            >
              회원가입
            </button>
            <div className="login-bottom">
              <span onClick={_onGetByEmail}>
                아이디 찾기
              </span>
              <span onClick={_onGetByPassword}>
                비밀번호 재설정
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
