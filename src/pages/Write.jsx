import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './Write.css';

const PhysicsBg = () => (
  <div className="physics-bg">
    {['⚛️','🔭','🧲','⚡','🌊','🔬','💫','🪐'].map((icon, i) => (
      <span key={i}>{icon}</span>
    ))}
  </div>
);

export default function Write() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      return setError('JPG, PNG, WEBP, GIF 이미지만 업로드 가능합니다.');
    }
    if (file.size > 5 * 1024 * 1024) {
      return setError('이미지는 5MB 이하만 가능합니다.');
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      return setError('제목과 내용을 모두 입력해주세요.');
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('content', content.trim());
    if (image) formData.append('image', image);

    setLoading(true);
    try {
      const res = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/board/${res.data.postId}`);
    } catch (err) {
      setError(err.response?.data?.error || '질문 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PhysicsBg />
      <div className="page-wrapper">
        <h1 className="page-title">✏️ 질문하기</h1>

        <div className="write-card card">
          {error && <div className="msg-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>제목 <span className="label-hint">(최대 200자)</span></label>
              <input
                type="text"
                placeholder="궁금한 내용을 간단히 적어주세요"
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={200}
                required
              />
              <span className="char-count-right">{title.length} / 200</span>
            </div>

            <div className="form-group">
              <label>내용 <span className="label-hint">(최대 5000자)</span></label>
              <textarea
                rows={10}
                placeholder="질문 내용을 자세히 적어주세요 😊&#10;어떤 부분이 이해가 안 되는지, 어떤 문제인지 등..."
                value={content}
                onChange={e => setContent(e.target.value)}
                maxLength={5000}
                required
              />
              <span className="char-count-right">{content.length} / 5000</span>
            </div>

            <div className="form-group">
              <label>이미지 첨부 <span className="label-hint">(선택, 최대 5MB)</span></label>
              <div className="upload-area" onClick={() => document.getElementById('imgInput').click()}>
                {preview ? (
                  <img src={preview} alt="미리보기" className="upload-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <span className="upload-icon">🖼️</span>
                    <p>클릭해서 이미지를 선택하세요</p>
                    <p className="upload-hint">JPG, PNG, WEBP, GIF</p>
                  </div>
                )}
              </div>
              <input
                id="imgInput"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImage}
                style={{ display: 'none' }}
              />
              {preview && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ marginTop: 8, fontSize: 12 }}
                  onClick={() => { setImage(null); setPreview(null); }}
                >✕ 이미지 제거</button>
              )}
            </div>

            <div className="write-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate('/board')}
              >취소</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? '등록 중...' : '🚀 질문 등록'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
