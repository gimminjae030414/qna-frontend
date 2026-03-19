import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      navigate('/board');
    } catch (err) {
      setError(err.response?.data?.error || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="physics-bg">
        {['⚛️','🔭','🧲','⚡','🌊','🔬','💫','🪐'].map((icon, i) => (
          <span key={i}>{icon}</span>
        ))}
      </div>
      <div className="auth-card card">
        <div className="auth-icon">🔑</div>
        <h1 className="auth-title">로그인</h1>
        <p className="auth-sub">물리 Q&A 게시판에 오신 걸 환영해요!</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="msg-error">⚠️ {error}</div>}

          <div className="form-group">
            <label>아이디</label>
            <input
              type="text"
              placeholder="아이디를 입력하세요"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
              maxLength={20}
            />
          </div>

          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? '로그인 중...' : '🚀 로그인'}
          </button>
        </form>

        <p className="auth-footer">
          아직 계정이 없으신가요? <Link to="/register">회원가입</Link>
        </p>
      </div>
    </div>
  );
}
