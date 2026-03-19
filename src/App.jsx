import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Board from './pages/Board';
import PostDetail from './pages/PostDetail';
import Write from './pages/Write';
import Admin from './pages/Admin';

// 로그인 필요한 페이지
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

// 관리자 전용 페이지
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/board" replace />;
  return children;
};

// 이미 로그인한 경우 /login, /register 접근 방지
const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/board" replace /> : children;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/board" element={<PrivateRoute><Board /></PrivateRoute>} />
        <Route path="/board/:id" element={<PrivateRoute><PostDetail /></PrivateRoute>} />
        <Route path="/write" element={<PrivateRoute><Write /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
