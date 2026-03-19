import { useEffect, useState } from 'react';
import api from '../utils/api';
import './Admin.css';

const PhysicsBg = () => (
  <div className="physics-bg">
    {['⚛️','🔭','🧲','⚡','🌊','🔬','💫','🪐'].map((icon, i) => (
      <span key={i}>{icon}</span>
    ))}
  </div>
);

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState('stats');
  const [newCode, setNewCode] = useState('');
  const [codeMsg, setCodeMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, postsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/posts'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setPosts(postsRes.data);
    } catch {
      // 403은 인터셉터가 처리
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDeleteUser = async (id, username) => {
    if (!window.confirm(`${username} 학생을 삭제하시겠어요?`)) return;
    await api.delete(`/admin/users/${id}`);
    fetchAll();
  };

  const handleDeletePost = async (id, title) => {
    if (!window.confirm(`"${title}" 게시글을 삭제하시겠어요?`)) return;
    await api.delete(`/admin/posts/${id}`);
    fetchAll();
  };

  const handleCodeChange = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch('/admin/invite-code', { newCode });
      setCodeMsg(`✅ ${res.data.message}`);
      setNewCode('');
    } catch (err) {
      setCodeMsg(`❌ ${err.response?.data?.error || '변경 실패'}`);
    }
  };

  if (loading) return <div className="spinner">⚛️</div>;

  return (
    <>
      <PhysicsBg />
      <div className="page-wrapper">
        <h1 className="page-title">🛡️ 관리자 대시보드</h1>

        {/* 탭 */}
        <div className="admin-tabs">
          {[
            { key: 'stats', label: '📊 통계' },
            { key: 'users', label: `👤 학생 (${users.filter(u => u.role === 'student').length})` },
            { key: 'posts', label: `📋 게시글 (${posts.length})` },
            { key: 'settings', label: '⚙️ 설정' },
          ].map(t => (
            <button
              key={t.key}
              className={`admin-tab ${tab === t.key ? 'active' : ''}`}
              onClick={() => setTab(t.key)}
            >{t.label}</button>
          ))}
        </div>

        {/* 통계 */}
        {tab === 'stats' && stats && (
          <div className="admin-stats">
            {[
              { icon: '👩‍🎓', label: '가입 학생', value: stats.studentCount },
              { icon: '📋', label: '총 질문', value: stats.postCount },
              { icon: '💬', label: '총 답글', value: stats.replyCount },
            ].map(s => (
              <div key={s.label} className="stat-card card">
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* 학생 목록 */}
        {tab === 'users' && (
          <div className="admin-table-wrap card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>아이디</th>
                  <th>가입일</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(u => u.role === 'student').map(u => (
                  <tr key={u.id}>
                    <td>👤 {u.username}</td>
                    <td>{new Date(u.created_at).toLocaleDateString('ko-KR')}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '5px 12px', fontSize: 12 }}
                        onClick={() => handleDeleteUser(u.id, u.username)}
                      >삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 게시글 목록 */}
        {tab === 'posts' && (
          <div className="admin-table-wrap card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>날짜</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(p => (
                  <tr key={p.id}>
                    <td className="post-title-cell">{p.title}</td>
                    <td>👤 {p.username}</td>
                    <td>{new Date(p.created_at).toLocaleDateString('ko-KR')}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '5px 12px', fontSize: 12 }}
                        onClick={() => handleDeletePost(p.id, p.title)}
                      >삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 설정 */}
        {tab === 'settings' && (
          <div className="admin-settings card">
            <h3 className="settings-title">🔐 초대 코드 변경</h3>
            <p className="settings-desc">새로운 초대 코드를 설정하면 기존 코드는 즉시 무효화돼요.</p>
            {codeMsg && <div className={codeMsg.startsWith('✅') ? 'msg-success' : 'msg-error'}>{codeMsg}</div>}
            <form onSubmit={handleCodeChange} className="code-form">
              <input
                type="text"
                placeholder="새 초대 코드 (4자 이상)"
                value={newCode}
                onChange={e => setNewCode(e.target.value)}
                minLength={4}
                required
              />
              <button type="submit" className="btn btn-primary">변경하기</button>
            </form>
            <div className="settings-note">
              ⚠️ 서버를 재시작하면 .env 파일의 코드로 초기화됩니다. 영구 변경은 .env를 수정하세요.
            </div>
          </div>
        )}
      </div>
    </>
  );
}
