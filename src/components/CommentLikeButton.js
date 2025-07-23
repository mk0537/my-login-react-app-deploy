import React, { useState, useEffect, useContext } from "react";
import empty_heart from "../asset/icons/empty_heart.png";
import full_heart from "../asset/icons/full_heart.png";
import { UserContext } from "../contexts/UserContext";
import { fetchLikeCount, fetchLikeStatus, toggleCommentLike } from "../api/likes";

const CommentLikeButton = ({ commentId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const { user } = useContext(UserContext);
  const token = user?.token;

  useEffect(() => {
    if (!commentId) return;

    fetchLikeCount(commentId)
      .then(setLikeCount)
      .catch(console.error);

    if (token) {
      fetchLikeStatus(commentId)
        .then(setLiked)
        .catch(console.error);
    } else {
      setLiked(false);
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
