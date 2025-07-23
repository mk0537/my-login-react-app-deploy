import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { issueTempPassword } from '../../api/users';

const TempPassword = () => {
  const [email, setEmail] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setTempPassword('');
    setError('');

    try {
      const tempPwd = await issueTempPassword({ email });
      setTempPassword(tempPwd);
    } catch (err) {
      const message = err.response?.data || '임시 비밀번호 발급에 실패했습니다.';
      setError(message);
    }
  };

  const _loginOnclick = () => {
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="temp-container-container">
        <h2>비밀번호 재설정</h2>
        <form className="form-group" onSubmit={handleResetPassword}>
          <div>
            <label>이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="가입한 이메일을 입력하세요"
              required
            />
          </div>
          <div className="button-group">
            <button className="login-btn" type="submit">임시 비밀번호 발급</button>
          </div>
        </form>

        {tempPassword && (
          <div style={{ marginTop: '15px' }}>
            발급된 임시 비밀번호: <strong style={{color: 'green'}}>{tempPassword}</strong>
            <br />
            <small>로그인 후 반드시 비밀번호를 변경하세요.</small>
            <div className='button-group-temp-password'>
              <button type="button" className="temp-password-btn" onClick={_loginOnclick}>
                로그인 하러 가기
              </button>
            </div>
          </div>
        )}

        {error && (
          <div style={{ marginTop: '15px', color: 'red' }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default TempPassword;
