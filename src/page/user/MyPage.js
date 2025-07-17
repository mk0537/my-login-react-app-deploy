import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("로그인 후 이용 가능합니다.");
      navigate("/login");
      return;
    }

    // 회원 정보 조회하기
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://54.89.157.164/login/user", {
          headers: {
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error("회원 정보를 불러오지 못했습니다.");
        }

        const data = await response.json();
        setUserInfo(data);
        setError("");
      } catch (error) {
        console.error("유저 정보 조회 실패:", error);
        setError(error.message);
      }
    };

    fetchUserInfo();
  }, [navigate]);


  // 회원 수정 버튼 클릭
  const _updateUserInfo = () => {
  navigate("/edit-profile", { state: { userInfo } });
};


// 회원 탈퇴 클릭
  const _deleteUser = async () => {
  const confirmed = window.confirm("정말로 탈퇴하시겠습니까?");
  if (!confirmed) return;

  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`http://54.89.157.164/login/user?id=${userInfo.id}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "회원 탈퇴 실패");
    }

    alert("회원 탈퇴가 완료되었습니다.");
    localStorage.removeItem("token");
    navigate("/"); 
  } catch (error) {
    console.error("회원 탈퇴 에러:", error);
    alert("탈퇴 중 오류가 발생했습니다: " + error.message);
  }
};

  if (error) {
    return <div className="container">오류: {error}</div>;
  }

  if (!userInfo) {
    return <div className="container">로딩 중...</div>;
  }

  return (
    <div className="container">
      <div className="login-container">
        <h2 style={{margin : "10px"}}>회원 정보 조회</h2>
        <div className="user-info">
          <h3>회원 정보</h3>
          <p>이메일: {userInfo.email}</p>
          <p>닉네임: {userInfo.nickName}</p>
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
      </div>
    </div>
  );
};

export default MyPage;
