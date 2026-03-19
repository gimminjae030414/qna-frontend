import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const PhysicsBg = () => (
  <div className="physics-bg">
    {['⚛️','🔭','🧲','⚡','🌊','🔬','💫','🪐'].map((icon, i) => (
      <span key={i}>{icon}</span>
    ))}
  </div>
);

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <PhysicsBg />
      <div className="home-wrapper">
        <div className="home-hero card">
          <div className="hero-icon">⚛️</div>
          <h1 className="hero-title">물리 Q&A 게시판</h1>
          <p className="hero-subtitle">
            궁금한 물리 개념, 언제든지 질문하세요! 🌟<br />
            선생님이 꼼꼼히 답변해드릴게요
          </p>
          <div className="hero-btns">
            {user ? (
              <>
                <Link to="/board" className="btn btn-primary hero-btn">📋 질문 보러가기</Link>
                <Link to="/write" className="btn btn-ghost hero-btn">✏️ 질문하기</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary hero-btn">🔑 로그인</Link>
                <Link to="/register" className="btn btn-ghost hero-btn">✨ 회원가입</Link>
              </>
            )}
          </div>
        </div>

        <div className="home-features">
          {[
            { icon: '🔐', title: '안전한 공간', desc: '초대 코드로 가입한 학생들만 이용 가능해요' },
            { icon: '🖼️', title: '이미지 첨부', desc: '문제 사진을 찍어서 같이 올릴 수 있어요' },
            { icon: '⚡', title: '빠른 답변', desc: '선생님 답변이 항상 제일 위에 보여요' },
          ].map((f) => (
            <div key={f.title} className="feature-card card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
