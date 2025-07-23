import React, { useEffect, useState } from 'react';
import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
} from '../api/comments';
import CommentLikeButton from './CommentLikeButton';
import { formatRelativeTime } from '../utils/date'; 

const CommentList = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newContent, setNewContent] = useState('');
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    const data = await fetchComments(postId);
    setComments(data);
  };

  const handleCreate = async () => {
    if (newContent.trim() === '') return;
    await createComment(postId, newContent);
    setNewContent('');
    loadComments();
  };

  const handleUpdate = async (id) => {
    await updateComment(id, editContent);
    setEditId(null);
    loadComments();
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await deleteComment(id);
      loadComments();
    }
  };

  return (
    <div>
      <h3>
        댓글 <span style={{ fontWeight: "normal" }}>({comments.length})</span>
      </h3>

      {comments.length === 0 ? (
        <p style={{ color: "#777", marginTop: "8px" }}>댓글이 없습니다.</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="comment-item">
            <strong>{c.author}</strong> &nbsp;
            <span>{formatRelativeTime(c.createdAt)}</span>

            {editId === c.id ? (
              <div>
                <input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  style={{
                    width: "400px",
                    height: "20px",
                    padding: "8px",
                    marginTop: "30px",
                    fontSize: "14px",
                  }}
                />
                <div className="comment-actions">
                  <button className="comment-action-btn" onClick={() => handleUpdate(c.id)}>저장</button>
                  <button className="comment-action-btn" onClick={() => setEditId(null)}>취소</button>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '18px' }}>{c.content}</p>
                <div className="comment-actions">
                  <CommentLikeButton commentId={c.id} />
                  {currentUser === c.email && (
                    <>
                      <button className="comment-action-btn" onClick={() => {
                        setEditId(c.id);
                        setEditContent(c.content);
                      }}>수정</button>
                      <button className="comment-action-btn" onClick={() => handleDelete(c.id)}>삭제</button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      )}

      <div className="comment-form-container">
        <textarea
          className="comment-textarea"
          placeholder="댓글을 입력하세요"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <button className="comment-submit-btn" onClick={handleCreate}>등록</button>
      </div>
    </div>
  );
};

export default CommentList;
