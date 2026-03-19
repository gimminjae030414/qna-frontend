import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-atom">⚛️</span>
          <span className="logo-text">물리Q&A</span>
        </Link>

        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/board" className="nav-link">📋 질문 게시판</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link admin-link">🛡️ 관리자</Link>
              )}
              <span className="nav-user">👤 {user.username}</span>
              <button onClick={handleLogout} className="btn btn-ghost nav-btn">로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost nav-btn">로그인</Link>
              <Link to="/register" className="btn btn-primary nav-btn">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
