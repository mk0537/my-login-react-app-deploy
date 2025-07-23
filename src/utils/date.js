export const toDateFromArray = (arr) =>
  Array.isArray(arr) && arr.length === 7
    ? new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5], arr[6]))
    : null;

export const formatRelativeTime = (timestamp) => {
  const target = Array.isArray(timestamp) ? toDateFromArray(timestamp) : new Date(timestamp);
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
