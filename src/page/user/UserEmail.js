
// src/pages/CheckEmail.js
import React, { useState } from "react";

const UserEmail = () => {
  const [email, setEmail] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

    const onCheckClick = async () => {
        try {
        const response = await fetch(`http://54.89.157.164/login/user/email?email=${encodeURIComponent(email)}`);
        
        if (!response.ok) {
            throw new Error("회원 정보를 찾을 수 없습니다.");
        }

        const data = await response.json();
        setUserInfo(data);
        setError("");
        } catch (err) {
        setUserInfo(null);
        setError(err.message);
        }
    };

    const _updateUserInfo = () => {

    }


    const _deleteUser = () => {

    }

  return (
    <div className="container">
      <div className="login-container">
        <h2>회원 정보 조회</h2>
        <div className="form-group">
            <input
            type="text"
            placeholder="아이디(이메일)를 입력하세요."
            value={email}
            onChange={onChangeEmail}
            />
        </div>
        <div className="button-group">
            <button className="login-btn" onClick={onCheckClick}>조회하기</button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {userInfo && (
          <div className="user-info">
            <h3>회원 정보</h3>
            <p>이메일: {userInfo.email}</p>
            <p>이름: {userInfo.name}</p>
                <div className="button-group2">
            <button className="update-btn" onClick={_updateUserInfo}>
                정보 수정
            </button>
            <button className="update-btn" onClick={_deleteUser}>
                회원 탈퇴
            </button>
            </div>
          </div>
          
        )}
      </div>
    </div>
  );
};

export default UserEmail;
