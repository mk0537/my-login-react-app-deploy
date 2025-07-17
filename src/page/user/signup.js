import React, { useState, useContext } from "react";
import "../../css/styles.css";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../../contexts/UserContext";

const ErrorMessage = styled.span`
  color: red;
  font-size: 13px;
`;

const Signup = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [nickName, setNickName] = useState("");

  const [nameMessage, setNameMessage] = useState("");

  const [nickNameMessage, setNickNameMessage] = useState("");
  const [isNickNameValid, setIsNickNameValid] = useState(false);

  const [emailMessage, setEmailMessage] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  const [passwordMessage, setPasswordMessage] = useState("");

  const [confirmMessage, setConfirmMessage] = useState("");
  const [isConfirmValid, setIsConfirmValid] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // UserContext 사용


  const onChangeName = (e) => {
    const currentName = e.target.value;
    setName(currentName);

    const nameRegExp = /^[가-힣a-zA-Z]{2,20}$/;

    if (!nameRegExp.test(currentName)) {
      setNameMessage("올바른 이름을 입력해주세요.");
    } else {
      setNameMessage("");
    }
  };

  const onChangeNickName = async (e) => {
    const currentNickName = e.target.value;
    setNickName(currentNickName);

    const nickNameRegExp = /^[가-힣a-zA-Z0-9_]{2,20}$/;

    if (currentNickName === "") {
      setNickNameMessage("");
      setIsNickNameValid(false);
      return;
    }

    if (!nickNameRegExp.test(currentNickName)) {
      setNickNameMessage("올바른 닉네임 형식이 아닙니다.");
      setIsNickNameValid(false);
      return;
    }

    try {
      const response = await fetch(
        `http://54.89.157.164/login/auth/check-nickname?nickname=${encodeURIComponent(
          currentNickName
        )}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.exists) {
        setNickNameMessage("이미 존재하는 닉네임입니다.");
        setIsNickNameValid(false);
      } else {
        setNickNameMessage("사용 가능한 닉네임입니다.");
        setIsNickNameValid(true);
      }
    } catch (error) {
      console.error("닉네임 중복 확인 실패", error);
      setNickNameMessage("닉네임 확인 중 오류가 발생했습니다.");
      setIsNickNameValid(false);
    }
  };

  const onChangeEmail = async (e) => {
    const currentEmail = e.target.value;
    setEmail(currentEmail);

    const emailRegExp =
      /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;

    if (currentEmail === "") {
      setEmailMessage("");
      setIsEmailValid(false);
      return;
    }

    if (!emailRegExp.test(currentEmail)) {
      setEmailMessage("올바른 이메일 형식이 아닙니다.");
      setIsEmailValid(false);
      return;
    }

    try {
      const response = await fetch(
        `http://54.89.157.164/login/auth/check-email?email=${encodeURIComponent(
          currentEmail
        )}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.exists) {
        setEmailMessage("이미 존재하는 이메일입니다.");
        setIsEmailValid(false);
      } else {
        setEmailMessage("사용 가능한 이메일입니다.");
        setIsEmailValid(true);
      }
    } catch (error) {
      console.error("이메일 중복 확인 실패", error);
      setEmailMessage("이메일 확인 중 오류가 발생했습니다.");
      setIsEmailValid(false);
    }
  };

  const onChangePassword = (e) => {
    const currentPassword = e.target.value;
    setPassword(currentPassword);

    const passwordRegExp =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,20}$/;

    if (!passwordRegExp.test(currentPassword)) {
      setPasswordMessage(
        "대문자, 숫자, 특수문자(!@#$%^&*)를 포함한 6-20자를 입력해주세요."
      );
    } else {
      setPasswordMessage("");
    }
  };

  const onChangeConfirm = (e) => {
    const currentConfirm = e.target.value;
    setConfirm(currentConfirm);

    if (currentConfirm === "") {
      setConfirmMessage("");
      setIsConfirmValid(false);
      return;
    }

    if (currentConfirm !== password) {
      setConfirmMessage("비밀번호가 일치하지 않습니다.");
      setIsConfirmValid(false);
    } else {
      setConfirmMessage("비밀번호가 일치합니다.");
      setIsConfirmValid(true);
    }
  };

  const _signupOnclick = async (e) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !nickName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirm.trim()
    ) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    if (!isEmailValid) {
      alert("이메일 중복 확인을 완료해주세요.");
      return;
    }

    if (!isNickNameValid) {
      alert("닉네임 중복 확인을 완료해주세요.");
      return;
    }

    try {
      // 1) 회원가입 요청
      const signupRes = await fetch("http://54.89.157.164/login/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password, name, nickName }),
      });

      if (!signupRes.ok) {
        const errData = await signupRes.json().catch(() => ({}));
        throw new Error(errData.message || "회원가입 실패");
      }

      // 2) 회원가입 성공하면 자동 로그인 API 호출
      const loginRes = await fetch("http://54.89.157.164/login/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });

      if (!loginRes.ok) {
        const errData = await loginRes.json().catch(() => ({}));
        throw new Error(errData.message || "자동 로그인 실패");
      }

      const loginResult = await loginRes.json();

      // 3) UserContext 및 localStorage에 로그인 정보 저장
      setUser({
        email: loginResult.email,
        nickName: loginResult.nickName,
        name: loginResult.name,
        id: loginResult.id,
        token: loginResult.token,
      });

      localStorage.setItem("token", loginResult.token);
      localStorage.setItem("email", loginResult.email);
      localStorage.setItem("nickName", loginResult.nickName);
      localStorage.setItem("name", loginResult.name);

      alert("회원가입이 완료되었습니다.");
      navigate("/");

    } catch (error) {
      console.error(error);
      alert("오류 발생: " + error.message);
    }
  };

  const _loginOnclick = () => {
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="signup-container">
        <h2>회원가입</h2>
        <form onSubmit={_signupOnclick}>
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={onChangeName}
              placeholder="이름 입력하세요."
            />
            <ErrorMessage>{nameMessage}</ErrorMessage>
          </div>
          <div className="form-group">
            <label htmlFor="nickname">닉네임</label>
            <input
              type="text"
              name="nickName"
              id="nickname"
              value={nickName}
              onChange={onChangeNickName}
              placeholder="닉네임 입력하세요."
            />
            <span
              style={{ color: isNickNameValid ? "green" : "red", fontSize: 13 }}
            >
              {nickNameMessage}
            </span>
          </div>
          <div className="form-group">
            <label htmlFor="email">이메일(아이디)</label>
            <input
              type="text"
              name="email"
              id="email"
              value={email}
              onChange={onChangeEmail}
              placeholder="이메일을 입력하세요."
            />
            <span
              style={{ color: isEmailValid ? "green" : "red", fontSize: 13 }}
            >
              {emailMessage}
            </span>
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={onChangePassword}
              placeholder="비밀번호를 입력하세요."
              maxLength={16}
            />
            <ErrorMessage>{passwordMessage}</ErrorMessage>
          </div>
          <div className="form-group">
            <label htmlFor="confirm">비밀번호 확인</label>
            <input
              type="password"
              name="confirm"
              id="confirm"
              value={confirm}
              onChange={onChangeConfirm}
              placeholder="비밀번호를 다시 입력해주세요."
              maxLength={16}
            />
            <span
              style={{ color: isConfirmValid ? "green" : "red", fontSize: 13 }}
            >
              {confirmMessage}
            </span>
          </div>
          <div className="button-group">
            <button type="submit" className="login-btn">
              회원가입하기
          </button>
          <button type="button" className="signup-btn" onClick={_loginOnclick}>
              돌아가기
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
