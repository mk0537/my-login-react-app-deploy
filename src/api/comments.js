import axios from '../api/axiosInstance';

const baseURL = '/api/comments';

// 댓글 조회
export const fetchComments = async (postId) => {
  const res = await axios.get(`${baseURL}/${postId}`);
  return res.data;
};

// 댓글 작성
export const createComment = async (postId, content) => {
  const res = await axios.post(`${baseURL}/${postId}`, { content });
  return res.data;
};

// 댓글 수정
export const updateComment = async (commentId, content) => {
  const res = await axios.put(`${baseURL}/${commentId}`, { content });
  return res.data;
};

// 댓글 삭제
export const deleteComment = async (commentId) => {
  await axios.delete(`${baseURL}/${commentId}`);
};