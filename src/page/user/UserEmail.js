import React, { useState } from "react";
import { getUserByEmail } from "../../api/users";
import { useNavigate } from "react-router-dom";

const UserEmail = () => {
  const [email, setEmail] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onCheckClick = async () => {
    setError("");
    setUserInfo(null);
    try {
      const data = await getUserByEmail(email);
      setUserInfo(data);
    } catch (err) {
      setError(err.message || "회원 정보를 찾을 수 없습니다.");
    }
  };

  const _updateUserInfo = () => {
    if (!userInfo) return;
    navigate("/edit-profile", { state: { userInfo } });
  };

  const _deleteUser = async () => {
    if (!userInfo) return;
    if (!window.confirm("정말로 탈퇴하시겠습니까?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://54.89.157.164:8080/login/user?id=${userInfo.id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "회원 탈퇴 실패");
      }
      alert("회원 탈퇴가 완료되었습니다.");
      localStorage.clear();
      navigate("/");
    } catch (error) {
      alert("탈퇴 중 오류가 발생했습니다: " + error.message);
    }
  };

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
          <button className="login-btn" onClick={onCheckClick}>
            조회하기
          </button>
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
