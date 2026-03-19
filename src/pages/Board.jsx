import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './Board.css';

const PhysicsBg = () => (
  <div className="physics-bg">
    {['⚛️','🔭','🧲','⚡','🌊','🔬','💫','🪐'].map((icon, i) => (
      <span key={i}>{icon}</span>
    ))}
  </div>
);

export default function Board() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPosts = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/posts?page=${p}&limit=10`);
      setPosts(res.data.posts);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
      setPage(p);
    } catch {
      // 401은 api.js 인터셉터가 처리
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  return (
    <>
      <PhysicsBg />
      <div className="page-wrapper">
        <div className="board-header">
          <h1 className="page-title">📋 질문 게시판</h1>
          <Link to="/write" className="btn btn-primary">✏️ 질문하기</Link>
        </div>

        <p className="board-count">총 <strong>{total}</strong>개의 질문</p>

        {loading ? (
          <div className="spinner">⚛️</div>
        ) : posts.length === 0 ? (
          <div className="board-empty card">
            <div className="empty-icon">🔭</div>
            <p>아직 질문이 없어요. 첫 번째 질문을 올려보세요!</p>
            <Link to="/write" className="btn btn-primary" style={{ marginTop: 16 }}>✏️ 질문하기</Link>
          </div>
        ) : (
          <div className="board-list">
            {posts.map(post => (
              <div
                key={post.id}
                className="board-item card"
                onClick={() => navigate(`/board/${post.id}`)}
              >
                <div className="board-item-main">
                  <h3 className="board-item-title">{post.title}</h3>
                  <div className="board-item-meta">
                    <span>👤 {post.username}</span>
                    <span>💬 {post.reply_count}개의 답글</span>
                    <span>🕐 {new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>
                {post.image_url && (
                  <div className="board-item-thumb">
                    <img src={post.image_url} alt="첨부 이미지" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="btn btn-ghost"
              onClick={() => fetchPosts(page - 1)}
              disabled={page <= 1}
            >◀ 이전</button>
            <span className="page-info">{page} / {totalPages}</span>
            <button
              className="btn btn-ghost"
              onClick={() => fetchPosts(page + 1)}
              disabled={page >= totalPages}
            >다음 ▶</button>
          </div>
        )}
      </div>
    </>
  );
}
