import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { increaseViewCount } from "../api/posts";
import { fetchLikeCount, fetchLikeStatus } from "../api/likes";
import LikeButton from "./PostLikeButton";
import { formatRelativeTime } from "../utils/date";
import DOMPurify from "dompurify";

const PostItem = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    // 좋아요 수 조회
    fetchLikeCount(post.id)
      .then(setLikeCount)
      .catch((err) => console.error("좋아요 수 조회 실패:", err));

    // 로그인 상태일 때만 좋아요 상태 조회
    if (token) {
      fetchLikeStatus(post.id)
        .then(setLiked)
        .catch((err) => console.error("좋아요 상태 조회 실패:", err));
    } else {
      setLiked(false);
    }
  }, [post.id, token]);

  const timeAgo = post?.createdAt
    ? formatRelativeTime(post.createdAt)
    : "작성일 정보 없음";

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
      <h3 style={{ marginTop: "5px" }}>
        {post.title?.trim() ? post.title : "제목없음"}
      </h3>

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
