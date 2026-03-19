import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '', inviteCode: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      return setError('비밀번호가 일치하지 않습니다.');
    }
    if (form.password.length < 8) {
      return setError('비밀번호는 8자 이상이어야 합니다.');
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        username: form.username,
        password: form.password,
        inviteCode: form.inviteCode,
      });
      setSuccess('가입 완료! 로그인 페이지로 이동합니다 🎉');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setError(err.response?.data?.error || '회원가입에 실패했습니다.');
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
        <div className="auth-icon">✨</div>
        <h1 className="auth-title">회원가입</h1>
        <p className="auth-sub">선생님께 받은 초대 코드가 필요해요!</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="msg-error">⚠️ {error}</div>}
          {success && <div className="msg-success">🎉 {success}</div>}

          <div className="form-group">
            <label>아이디 <span className="label-hint">(한글/영문/숫자, 2~20자)</span></label>
            <input
              type="text"
              placeholder="사용할 아이디"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required maxLength={20}
            />
          </div>

          <div className="form-group">
            <label>비밀번호 <span className="label-hint">(8자 이상)</span></label>
            <input
              type="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>비밀번호 확인</label>
            <input
              type="password"
              placeholder="비밀번호 재입력"
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>초대 코드 🔐</label>
            <input
              type="text"
              placeholder="선생님께 받은 초대 코드"
              value={form.inviteCode}
              onChange={e => setForm({ ...form, inviteCode: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? '가입 중...' : '🌟 가입하기'}
          </button>
        </form>

        <p className="auth-footer">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
}
