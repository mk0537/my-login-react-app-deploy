import axios from '../api/axiosInstance';

const API_BASE = '/api/comments';

// 댓글 조회
export const fetchComments = async (postId) => {
  const res = await axios.get(`${API_BASE}/${postId}`);
  return res.data;
};

// 댓글 작성
export const createComment = async (postId, content) => {
  const res = await axios.post(`${API_BASE}/${postId}`, { content });
  return res.data;
};

// 댓글 수정
export const updateComment = async (commentId, content) => {
  const res = await axios.put(`${API_BASE}/${commentId}`, { content });
  return res.data;
};

// 댓글 삭제
export const deleteComment = async (commentId) => {
  await axios.delete(`${API_BASE}/${commentId}`);
};
