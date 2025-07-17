import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPostById, updatePost } from "../../api/posts";

const PostEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const res = await fetchPostById(id);
        setTitle(res.data.title);
        setContent(res.data.content);
      } catch (err) {
        alert("게시글을 불러오는데 실패했습니다.");
        navigate("/posts");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePost(id, { title, content });
      alert("게시글이 성공적으로 수정되었습니다.");
      navigate(`/posts/post/${id}`);
    } catch (err) {
      alert("게시글 수정에 실패했습니다.");
      console.error(err);
    }
  };

  if (loading) return <div style={{ marginTop: "80px" }}>로딩 중...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>게시글 수정</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </div>
        <div>
          <label>내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </div>
        <button type="submit">수정 완료</button>
      </form>
    </div>
  );
};

export default PostEditPage;
