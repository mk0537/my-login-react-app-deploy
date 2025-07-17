// 게시글용 좋아요 버튼
import React, { useState, useEffect } from "react";
import empty_heart from "../asset/icons/empty_heart.png";
import full_heart from "../asset/icons/full_heart.png";

const PostLikeButton = ({ postId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // 좋아요 수 조회
    fetch(`http://http://54.89.157.164/likes/${postId}`)
      .then((res) => res.json())
      .then((data) => setLikeCount(data.likeCount))
      .catch(console.error);

    // 로그인 상태일 때만 좋아요 상태 조회
    if (token) {
      fetch(`http://http://54.89.157.164/likes/${postId}/status`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setLiked(data.liked))
        .catch(console.error);
    }
  }, [postId, token]);

  const handleLike = async (e) => {
    e.stopPropagation(); // 게시글 클릭 방지

    if (!token) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }

    try {
      const res = await fetch(`http://54.89.157.164/likes/${postId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      const newLiked = data.result === "liked";
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

export default PostLikeButton;
