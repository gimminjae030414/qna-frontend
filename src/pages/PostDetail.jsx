import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './PostDetail.css';

const PhysicsBg = () => (
  <div className="physics-bg">
    {['⚛️','🔭','🧲','⚡','🌊','🔬','💫','🪐'].map((icon, i) => (
      <span key={i}>{icon}</span>
    ))}
  </div>
);

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [replyError, setReplyError] = useState('');

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data.post);
      setReplies(res.data.replies);
    } catch (err) {
      setError('게시글을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPost(); }, [id]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    setReplyError('');
    setSubmitting(true);
    try {
      await api.post(`/replies/${id}`, { content: replyContent });
      setReplyContent('');
      fetchPost();
    } catch (err) {
      setReplyError(err.response?.data?.error || '답글 등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('정말 이 질문을 삭제하시겠어요?')) return;
    try {
      await api.delete(`/posts/${id}`);
      navigate('/board');
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm('이 답글을 삭제하시겠어요?')) return;
    try {
      await api.delete(`/replies/${replyId}`);
      fetchPost();
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  if (loading) return <div className="spinner">⚛️</div>;
  if (error) return (
    <div className="page-wrapper">
      <div className="msg-error">{error}</div>
      <Link to="/board" className="btn btn-ghost">← 목록으로</Link>
    </div>
  );

  return (
    <>
      <PhysicsBg />
      <div className="page-wrapper">
        <Link to="/board" className="back-link">← 목록으로</Link>

        {/* 질문 카드 */}
        <div className="post-card card">
          <div className="post-header">
            <h1 className="post-title">{post.title}</h1>
            <div className="post-meta">
              <span>👤 {post.username}</span>
              <span>🕐 {new Date(post.created_at).toLocaleString('ko-KR')}</span>
            </div>
          </div>

          <div className="post-content">{post.content}</div>

          {post.image_url && (
            <div className="post-image">
              <img src={post.image_url} alt="첨부 이미지" />
            </div>
          )}

          {(user?.role === 'admin' || user?.username === post.username) && (
            <div className="post-actions">
              <button className="btn btn-danger" onClick={handleDeletePost}>🗑️ 삭제</button>
            </div>
          )}
        </div>

        {/* 답글 목록 */}
        <div className="replies-section">
          <h2 className="replies-title">💬 답글 {replies.length}개</h2>

          {replies.length === 0 ? (
            <div className="no-replies card">아직 답글이 없어요. 첫 번째 답글을 달아보세요! 🌟</div>
          ) : (
            <div className="reply-list">
              {replies.map(reply => (
                <div
                  key={reply.id}
                  className={`reply-item card ${reply.is_admin ? 'reply-admin' : ''}`}
                >
                  <div className="reply-header">
                    <span className="reply-author">
                      {reply.is_admin && <span className="admin-badge">👩‍🏫 선생님</span>}
                      {!reply.is_admin && `👤 ${reply.username}`}
                    </span>
                    <span className="reply-date">
                      {new Date(reply.created_at).toLocaleString('ko-KR')}
                    </span>
                  </div>
                  <p className="reply-content">{reply.content}</p>
                  {(user?.role === 'admin' || user?.username === reply.username) && (
                    <button
                      className="btn btn-danger reply-delete"
                      onClick={() => handleDeleteReply(reply.id)}
                    >🗑️</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 답글 작성 */}
        <div className="reply-form card">
          <h3 className="reply-form-title">✏️ 답글 달기</h3>
          {replyError && <div className="msg-error">{replyError}</div>}
          <form onSubmit={handleReply}>
            <textarea
              rows={4}
              placeholder="답글을 입력하세요..."
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              maxLength={2000}
              required
            />
            <div className="reply-form-footer">
              <span className="char-count">{replyContent.length} / 2000</span>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? '등록 중...' : '💬 답글 등록'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
