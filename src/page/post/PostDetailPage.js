import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostById, deletePost } from "../../api/posts";
import PostLikeButton from "../../components/PostLikeButton";
import CommentList from "../../components/CommentList";

import DOMPurify from "dompurify";

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email"); // 작성자 본인 확인용

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchPostById(id);
        console.log("응답 구조 확인:", res);
        console.log("post data:", res.data); 
        setPost(res.data);
      } catch (err) {
        console.error("게시글 조회 실패", err);
      }
    };

    fetchData();
  }, [id]);

  if (!post) return <div style={{ marginTop: "80px" }}>로딩 중...</div>;

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const target = new Date(timestamp);
    const diffMs = now - target;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "방금 전";
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    return `${diffDay}일 전`;
  };

  const timeAgo = post?.createdAt ? formatRelativeTime(post.createdAt) : "작성일 정보 없음";

  const _handleEdit = () => {
    if (!token) {
      alert("로그인 후 이용 가능합니다.");
      navigate("/login");
      return;
    }
    navigate(`/posts/edit/${id}`);
  };

  const _handleDelete = async () => {
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmed) return;

    if (!token) {
      alert("로그인 후 이용 가능합니다.");
      navigate("/login");
      return;
    }

    try {
      await deletePost(id);
      alert("게시글이 삭제되었습니다.");
      navigate("/posts");
    } catch (err) {
      console.error("삭제 오류:", err);
      alert("본인만 게시물을 삭제할 수 있습니다.");
    }
  };

  return (
    <div className="container2">
      <div className="board-container">
        <div className="post-detail-header">
          <h2>{post.title?.trim() ? post.title : "제목없음"}</h2>
        </div>

        <div className="post-detail-info">
          <div className="post-meta">
            <span style={{ marginRight: "12px" }}>
              작성자: <strong>{post.nickName || "알 수 없음"}</strong>
            </span>
            <span style={{ marginRight: "12px" }}>
              조회수: <strong>{post.views || 0}</strong>
            </span>
            <span>
              작성일: <strong>{timeAgo}</strong>
            </span>
          </div>
          {post.email === email ? (
            <div className="button-group2" style={{ marginTop: "10px" }}>
              <PostLikeButton postId={post.id} />
              <button className="update-btn" onClick={_handleEdit}>
                수정
              </button>
              <button className="update-btn" onClick={_handleDelete}>
                삭제
              </button>
            </div>
          ) : (
            <PostLikeButton postId={post.id} />
          )}
        </div>

        <div className="post-detail-container">
          <div
            className="post-content"
            dangerouslySetInnerHTML={{
              __html: post.content?.trim()
                ? DOMPurify.sanitize(post.content)
                : "내용없음",
            }}
          />
        </div>
        </div>
        <div className="comment-container">
          <div className="comment-content">
            <CommentList postId={post.id} currentUser={email} />
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
