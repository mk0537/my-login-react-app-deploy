import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../../contexts/UserContext";
import { updateUserProfile, confirmCurrentPassword, changePassword } from "../../api/users";

const ErrorMessage = styled.span`
  color: red;
  font-size: 13px;
`;

const SuccessMessage = styled.span`
  color: green;
  font-size: 13px;
`;

const UserEditPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = location.state?.userInfo;

  const { user, setUser } = useContext(UserContext);

  const [form, setForm] = useState({
    name: "",
    nickName: "",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCheck, setNewPasswordCheck] = useState("");
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);

  const [isValidMessage, setIsValidMessage] = useState("");
  const [isValid, setIsValid] = useState(false);

  const [isCheckValidMessage, setIsCheckValidMessage] = useState("");
  const [isCheckValid, setIsCheckValid] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      alert("잘못된 접근입니다.");
      navigate("/mypage");
      return;
    }
    setForm({
      name: userInfo.name,
      nickName: userInfo.nickName,
    });
  }, [userInfo, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateNewPassword = (pwd) => {
    if (!pwd) {
      setIsValidMessage("");
      setIsValid(false);
      return;
    }
    if (pwd === currentPassword) {
      setIsValidMessage("기존 비밀번호와 다른 새 비밀번호를 입력하세요.");
      setIsValid(false);
    } else {
      setIsValidMessage("");
      setIsValid(true);
    }
  };

  const validateNewPasswordCheck = (pwdCheck) => {
    if (!pwdCheck) {
      setIsCheckValidMessage("");
      setIsCheckValid(false);
      return;
    }
    if (newPassword !== pwdCheck) {
      setIsCheckValidMessage("비밀번호가 일치하지 않습니다.");
      setIsCheckValid(false);
    } else {
      setIsCheckValidMessage("비밀번호가 일치합니다.");
      setIsCheckValid(true);
    }
  };

  const onNewPasswordChange = (e) => {
    const val = e.target.value;
    setNewPassword(val);
    validateNewPassword(val);
    if (newPasswordCheck) {
      validateNewPasswordCheck(newPasswordCheck);
    }
  };

  const onNewPasswordCheckChange = (e) => {
    const val = e.target.value;
    setNewPasswordCheck(val);
    validateNewPasswordCheck(val);
  };

  const handlePasswordConfirm = async () => {
    try {
      await confirmCurrentPassword(currentPassword);
      setIsPasswordConfirmed(true);
      alert("비밀번호가 확인되었습니다. 새 비밀번호를 입력하세요.");
    } catch (error) {
      alert("현재 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isPasswordConfirmed) {
      if (!newPassword || !newPasswordCheck) {
        alert("새 비밀번호를 입력해주세요.");
        return;
      }
      if (!isValid) {
        alert("새 비밀번호를 확인해주세요.");
        return;
      }
      if (!isCheckValid) {
        alert("새 비밀번호 확인이 일치하지 않습니다.");
        return;
      }
    }

    try {
      await updateUserProfile(userInfo.id, form);

      if (isPasswordConfirmed) {
        await changePassword(currentPassword, newPassword);
      }

      const updatedUser = { ...(user || {}), name: form.name, nickName: form.nickName };
      setUser(updatedUser);
      localStorage.setItem("nickName", form.nickName);
      localStorage.setItem("name", form.name);

      alert("정보가 성공적으로 수정되었습니다.");
      navigate("/mypage");
    } catch (error) {
      alert("수정 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="edit-container">
        <h2>회원 정보 수정</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>이름</label>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>닉네임</label>
            <input name="nickName" value={form.nickName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>현재 비밀번호</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            {!isPasswordConfirmed && (
              <button className="confirm-btn" type="button" onClick={handlePasswordConfirm}>
                비밀번호 확인
              </button>
            )}
          </div>

          {isPasswordConfirmed && (
            <>
              <div className="form-group">
                <label>새 비밀번호</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={onNewPasswordChange}
                />
                {isValid ? (
                  <SuccessMessage>{isValidMessage}</SuccessMessage>
                ) : (
                  <ErrorMessage>{isValidMessage}</ErrorMessage>
                )}
              </div>
              <div className="form-group">
                <label>새 비밀번호 확인</label>
                <input
                  type="password"
                  value={newPasswordCheck}
                  onChange={onNewPasswordCheckChange}
                />
                {isCheckValid ? (
                  <SuccessMessage>{isCheckValidMessage}</SuccessMessage>
                ) : (
                  <ErrorMessage>{isCheckValidMessage}</ErrorMessage>
                )}
              </div>
            </>
          )}

          <div className="button-group2">
            <button className="update-btn" type="submit">
              저장
            </button>
            <button className="update-btn" type="button" onClick={() => navigate("/mypage")}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditPage;
