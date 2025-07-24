import React, { useState, useEffect, useContext } from "react";
import full_heart from "../asset/icons/full_heart.png";
import empty_heart from "../asset/icons/empty_heart.png";
import { UserContext } from "../contexts/UserContext";
import {
  fetchLikeCount,
  fetchLikeStatus,
  togglePostLike,
} from "../api/likes";

const PostLikeButton = ({ postId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const { user } = useContext(UserContext);
  const token = user?.token;

  useEffect(() => {
    if (!postId) return;

    // 게시글 좋아요 수 조회
    fetchLikeCount(postId)
      .then(setLikeCount)
      .catch((err) => {
        console.error("게시글 좋아요 수 조회 실패:", err);
      });

    // 로그인한 경우에만 좋아요 상태 조회
    if (token) {
      fetchLikeStatus(postId)
        .then((liked) => {
          setLiked(liked);
        })
        .catch((err) => {
          console.error("게시글 좋아요 상태 조회 실패:", err);
        });
    }
  }, [postId, token]);

  const handleLike = async (e) => {
    e.stopPropagation();

    if (!token) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }

    try {
      const { result, likeCount: updatedCount } = await togglePostLike(postId);
      setLiked(result === "liked");
      setLikeCount(updatedCount);
    } catch (err) {
      console.error("게시글 좋아요 처리 실패:", err);
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

export default PostLikeButton;
