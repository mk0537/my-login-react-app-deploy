import axiosInstance from "./axiosInstance";

const BASE_URL = "/likes";


// 게시글 좋아요 수 조회
export const fetchLikeCount = async (postId) => {
  const res = await axiosInstance.get(`${BASE_URL}/${postId}`);
  return res.data.likeCount;
};

// 게시글 좋아요 여부 조회 (로그인 필요)
export const fetchLikeStatus = async (postId) => {
  try {
    const res = await axiosInstance.get(`${BASE_URL}/${postId}/status`);
    return res.data.liked;
  } catch (err) {
    // 인증되지 않은 경우 false 반환
    return false;
  }
};

// 게시글 좋아요 토글 (좋아요 / 취소)
export const togglePostLike = async (postId) => {
  const res = await axiosInstance.post(`${BASE_URL}/${postId}`);
  return {
    result: res.data.result,
    likeCount: res.data.likeCount,
  };
};

//----------------------------------------------------------------------------------

// 댓글 좋아요 수 조회
export const fetchCommentLikeCount = async (commentId) => {
  const res = await axiosInstance.get(`${BASE_URL}/comments/${commentId}`);
  return res.data.likeCount;
};

// 댓글 좋아요 여부 조회
export const fetchCommentLikeStatus = async (commentId) => {
  const res = await axiosInstance.get(`${BASE_URL}/comments/${commentId}/status`);
  return res.data.liked;
};

// 댓글 좋아요 토글 (좋아요/취소)
export const toggleCommentLike = async (commentId) => {
  const res = await axiosInstance.post(`${BASE_URL}/comments/${commentId}`);
  return res.data.result === "liked";
};