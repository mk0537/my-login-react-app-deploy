import React, { useState, useEffect, useContext } from "react";
import empty_heart from "../asset/icons/empty_heart.png";
import full_heart from "../asset/icons/full_heart.png";
import { UserContext } from "../contexts/UserContext";
import {
  fetchCommentLikeCount,
  fetchCommentLikeStatus,
  toggleCommentLike,
} from "../api/likes";

const CommentLikeButton = ({ commentId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const { user } = useContext(UserContext);
  const token = user?.token;

  useEffect(() => {
    if (!commentId) return;

    // 댓글 좋아요 수 조회
    fetchCommentLikeCount(commentId)
      .then(setLikeCount)
      .catch(console.error);

    // 토큰 존재 시 댓글 좋아요 상태 조회
    if (token) {
      fetchCommentLikeStatus(commentId)
        .then(setLiked)
        .catch((err) => {
          console.error("댓글 좋아요 상태 조회 실패:", err);
        });
    } else {
      setLiked(false); // 비로그인 시 상태 초기화
    }
  }, [commentId, token]);

  const handleLike = async (e) => {
    e.stopPropagation();

    if (!token) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }

    try {
      const newLiked = await toggleCommentLike(commentId);
      setLiked(newLiked);
      setLikeCount((prev) => (newLiked ? prev + 1 : Math.max(prev - 1, 0)));
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
    }
  };

  return (
    <button
      onClick={handleLike}
      className="like-button"
      style={{ border: "none", background: "transparent", cursor: "pointer" }}
    >
      <img
        src={liked ? full_heart : empty_heart}
        alt="좋아요"
        width={20}
        height={20}
      />
      <span style={{ marginLeft: 6 }}>{likeCount}</span>
    </button>
  );
};

export default CommentLikeButton;
