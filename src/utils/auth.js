// 토큰 만료 함수 만들기 (토큰이 만료되면 자동 로그아웃)
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const exp = decodedPayload.exp; // 만료시간 (초 단위 UNIX timestamp)

    const now = Math.floor(Date.now() / 1000); // 현재시간 (초)
    return exp < now; // 만료되었으면 true 반환
  } catch (e) {
    return true; // 디코딩 실패해도 만료된 걸로 처리
  }
};
