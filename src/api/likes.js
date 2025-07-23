import axiosInstance from "./axiosInstance";

const BASE_URL = "/likes";


// 좋아요 수 조회
export const fetchLikeCount = async (postId) => {
  const res = await axiosInstance.get(`${BASE_URL}/${postId}`);
  return res.data.likeCount;
};


// 좋아요 상태 조회
export const fetchLikeStatus = async (postId) => {
  const res = await axiosInstance.get(`${BASE_URL}/${postId}/status`);
  return res.data.liked;
};


// 댓글 좋아요 토글 (좋아요/취소)
export const toggleCommentLike = async (commentId) => {
  const res = await axiosInstance.post(`${BASE_URL}/comments/${commentId}`);
  return res.data.result === "liked";
};