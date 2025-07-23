import React, { useState, useEffect, useContext } from "react";
import empty_heart from "../asset/icons/empty_heart.png";
import full_heart from "../asset/icons/full_heart.png";
import axiosInstance from "../api/axiosInstance";
import { UserContext } from "../contexts/UserContext";

const PostLikeButton = ({ postId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const { user } = useContext(UserContext);
  const token = user?.token;

  useEffect(() => {
    // 좋아요 수 가져오기
    axiosInstance
      .get(`/likes/${postId}`)
      .then((res) => setLikeCount(res.data.likeCount))
      .catch(console.error);

    // 로그인 시 상태 가져오기
    if (token) {
      axiosInstance
        .get(`/likes/${postId}/status`)
        .then((res) => setLiked(res.data.liked))
        .catch((err) => {
          console.error("좋아요 상태 조회 실패:", err);
        });
    } else {
      setLiked(false);
    }
  }, [postId, token]);

  const handleLike = async (e) => {
    e.stopPropagation();

    if (!token) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }

    try {
      const res = await axiosInstance.post(`/likes/${postId}`);
      const newLiked = res.data.result === "liked";
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
