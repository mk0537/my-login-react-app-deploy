import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostById, deletePost } from "../../api/posts";
import PostLikeButton from "../../components/PostLikeButton";
import CommentList from "../../components/CommentList";
import { formatRelativeTime } from "../../utils/date";

import DOMPurify from "dompurify";

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email"); // 작성자 본인 확인용

  useEffect(() => {
    if (!token) {
      alert("로그인 후 이용 가능합니다.");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetchPostById(id);
        setPost(res.data);
      } catch (err) {
        console.error("게시글 조회 실패", err);
        // 필요하면 여기서도 401 처리 가능
      }
    };

    fetchData();
  }, [id, token, navigate]);

  if (!post) return <div style={{ marginTop: "80px" }}>로딩 중...</div>;

  // 사용
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
            {token && post?.id && <PostLikeButton postId={post.id} />}
            <button className="update-btn" onClick={_handleEdit}>
              수정
            </button>
            <button className="update-btn" onClick={_handleDelete}>
              삭제
            </button>
          </div>
        ) : (
          token && post?.id && <PostLikeButton postId={post.id} />
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