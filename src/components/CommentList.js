import React, { useEffect, useState } from 'react';
import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
} from '../api/comments';
import CommentLikeButton from './CommentLikeButton';

const CommentList = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newContent, setNewContent] = useState('');
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    loadComments();
  }, [postId]);

    // 상대시간 바꾸기
    const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffMs = now - created;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    return `${diffDay}일 전`;
    };

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
                    <button
                    className="comment-action-btn"
                    onClick={() => handleUpdate(c.id)}
                    >
                    저장
                    </button>
                    <button
                    className="comment-action-btn"
                    onClick={() => setEditId(null)}
                    >
                    취소
                    </button>
                </div>
                </div>
            ) : (
                <div>
                <p style={{fontSize: '18px'}}>{c.content}</p>
                <div className="comment-actions">
                     {/* 댓글 좋아요 버튼 */}
                    <CommentLikeButton commentId={c.id} />

                    {/* 작성자 본인에게만 수정/삭제 버튼 표시 */}
                    {currentUser === c.email && (
                    <>
                        <button
                        className="comment-action-btn"
                        onClick={() => {
                            setEditId(c.id);
                            setEditContent(c.content);
                        }}
                        >
                        수정
                        </button>
                        <button
                        className="comment-action-btn"
                        onClick={() => handleDelete(c.id)}
                        >
                        삭제
                        </button>
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
        <button className="comment-submit-btn" onClick={handleCreate}>
            등록
        </button>
        </div>
    </div>
    );

};

export default CommentList;
