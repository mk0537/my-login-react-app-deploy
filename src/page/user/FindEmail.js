import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FindEmail = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [resultEmail, setResultEmail] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  
  const handleFindEmail = async (e) => {
    e.preventDefault();
    setResultEmail('');
    setError('');

    try {
      const response = await fetch('http://54.89.157.164/login/find-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setResultEmail(data.email);
      } else {
        if (response.status === 401) {
          setError(data.error || '비밀번호가 틀렸습니다.');
        } else if (response.status === 404) {
          setError(data.error || '일치하는 계정이 없습니다.');
        } else {
          setError(data.error || '이메일을 찾을 수 없습니다.');
        }
      }
    } catch (err) {
      console.error('요청 실패:', err);
      setError('서버 오류가 발생했습니다.');
    }
  };

  const _loginOnclick = () => {
    navigate("/login");
  };

  return (
    <div className="container">
        <div className='find-email-container'>
            <h2>이메일(아이디) 찾기</h2>
            <form onSubmit={handleFindEmail}>
                <div className="form-group">
                <label>이름</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름을 입력하세요"
                />
                </div>
                <div className="form-group">
                <label>비밀번호</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                />
                </div>
                <div className="button-group">
                    <button type="submit" className="login-btn">아이디(이메일) 찾기</button>
                </div>
            </form>
            <div className='find-email'>
              {resultEmail && (
                  <div style={{ marginTop: '10px', alignItems:'center', color: 'green' }}>
                  찾은 이메일 : <strong>{resultEmail}</strong>
                  </div>
              )}

              {error && (
                  <div style={{ marginTop: '10px', color: 'red' }}>
                  {error}
                  </div>
              )}
            </div>
            {/* 이메일 찾기 성공했을 때만 로그인하러 가기 버튼 렌더링 */}
            {resultEmail && (
              <div className='button-group-find-email'>
                <button type="button" className="find-email-btn" onClick={_loginOnclick}>
                  로그인 하러 가기
                </button>
              </div>
            )}
      </div>
    </div>
  );
};

export default FindEmail;
