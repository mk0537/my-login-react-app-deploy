import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { increaseViewCount } from "../api/posts";
import  LikeButton  from "./PostLikeButton"

import DOMPurify from "dompurify";

const PostItem = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    // 좋아요 수 조회
    fetch(`http://54.89.157.164/likes/${post.id}`)
      .then((res) => res.json())
      .then((data) => setLikeCount(data.likeCount))
      .catch(console.error);

    // 로그인 상태일 때만 좋아요 상태 조회
    if (token) {
      fetch(`http://54.89.157.164/likes/${post.id}/status`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setLiked(data.liked))
        .catch(console.error);
    }
  }, [post.id, token]);




  // 작성일 포맷팅 (몇 시간/일 전)
  const createdDate = post.createdAt ? new Date(post.createdAt) : null;
  let timeAgo = "작성일 정보 없음";
  if (createdDate && !isNaN(createdDate)) {
    const now = new Date();
    const diffMs = now - createdDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    timeAgo =
      diffHours < 1
        ? "방금 전"
        : diffHours < 24
        ? `${diffHours}시간 전`
        : `${diffDays}일 전`;
  }

  const handleClick = async () => {
    if (!token) {
      alert("로그인 후 게시글을 열람할 수 있습니다.");
      navigate("/login");
      return;
    }

    try {
      await increaseViewCount(post.id, token);
    } catch (error) {
      console.error("조회수 증가 실패", error);
    }

    navigate(`/posts/${post.id}`);
  };

  return (
    <div className="post-item" onClick={handleClick}>
      <h3 style={{ marginTop: "5px" }}>{post.title?.trim() ? post.title : "제목없음"}</h3>

      <div className="post-item-content">
        <div
            className="post-content"
            dangerouslySetInnerHTML={{
              __html: post.content?.trim()
                ? DOMPurify.sanitize(post.content)
                : "내용없음",
            }}
          />
      </div>

      <div
        className="post-item-info"
        style={{ marginTop: 10, fontSize: 14, color: "#555" }}
      >
        <div className="post-meta">
          <span>
            작성자: <strong>{post.nickName || "익명"}</strong>
          </span>
          <span>
            조회수: <strong>{post.views || 0}</strong>
          </span>
          <span>
            작성일: <strong>{timeAgo}</strong>
          </span>
        </div>
        <LikeButton postId={post.id} />
      </div>
    </div>
  );
};

export default PostItem;
