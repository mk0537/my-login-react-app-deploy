// UTC 기준으로 Date 객체 생성 (시간대 문제 해결)
export const toDateFromArray = (arr) =>
  Array.isArray(arr) && arr.length === 7
    ? new Date(Date.UTC(
        arr[0],          // year
        arr[1] - 1,      // month (0-based)
        arr[2],          // day
        arr[3],          // hour
        arr[4],          // minute
        arr[5],          // second
        Math.floor(arr[6] / 1_000_000) // nanoseconds → milliseconds
      ))
    : null;

// 상대 시간 포맷팅 함수
export const formatRelativeTime = (timestamp) => {
  const target = Array.isArray(timestamp)
    ? toDateFromArray(timestamp)
    : new Date(timestamp);

  if (!target || isNaN(target)) return '작성일 정보 없음';

  const now = new Date();
  const diffMs = now - target;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  return `${diffDay}일 전`;
};
