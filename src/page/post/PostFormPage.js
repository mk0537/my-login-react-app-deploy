import React, { useState, useEffect, useRef } from "react";
import { createPost, updatePost, fetchPostById, uploadImage } from "../../api/posts";
import { useParams, useNavigate } from "react-router-dom";

// Toast UI Editor 관련 import
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

const PostFormPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(!!id);
  const editorRef = useRef(); // Toast Editor ref

  const navigate = useNavigate();

  // 게시글 불러오기 (수정 모드)
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchPostById(id)
        .then((res) => {
          setTitle(res.data.title);
          // 에디터에 HTML 형식 콘텐츠 세팅
          setTimeout(() => {
            editorRef.current?.getInstance().setHTML(res.data.content);
          }, 0);
        })
        .catch(() => alert("게시글 불러오기 실패"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = editorRef.current?.getInstance().getHTML(); // HTML 형태로 content 가져오기

    const postData = {
      title,
      content,
    };

    try {
      if (id) {
        await updatePost(id, postData);
        alert("게시글이 성공적으로 수정되었습니다.");
        navigate(`/posts`);
      } else {
        await createPost(postData);
        alert("게시글이 성공적으로 등록되었습니다.");
        navigate("/posts");
      }
    } catch (err) {
      alert(`게시글 ${id ? "수정" : "등록"}에 실패했습니다.`);
      console.error(err);
    }
  };

  if (loading) return <div style={{ marginTop: "80px" }}>로딩 중...</div>;

  return (
    <div className="post-form-container">
      <div className="board-container">
        <div className="board-header">
          <h2 className="board-title">{id ? "게시글 수정" : "새 글 작성"}</h2>
          <div className="form-group">
            <input
              className="post-input-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목"
            />

            {/* Toast UI Editor + 이미지 업로드 연동 */}
            <Editor
              ref={editorRef}
              previewStyle="vertical"
              height="400px"
              initialEditType="wysiwyg"
              useCommandShortcut={true}
              hooks={{
                addImageBlobHook: async (blob, callback) => {
                  try {
                    const imageUrl = await uploadImage(blob);
                    if (imageUrl) {
                      callback(imageUrl, "업로드 이미지");
                    }
                  } catch (error) {
                    alert("이미지 업로드 실패");
                  }
                },
              }}
            />

            <div className="button-group2">
              <button className="postListPage-btn2" onClick={handleSubmit}>
                {id ? "수정" : "등록"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostFormPage;
