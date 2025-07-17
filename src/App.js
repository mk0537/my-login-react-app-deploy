import { Routes, Route, useLocation, Link } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Login from "./page/user/login";
import Signup from "./page/user/signup";
import MyPage from "./page/user/MyPage";
import UserEmail from "./page/user/UserEmail";
import PostDetailPage from "./page/post/PostDetailPage";
import PostFormPage from "./page/post/PostFormPage";
import PostListPage from "./page/post/PostListPage";
import UserEditPage from "./page/user/UserEditPage";
import HeaderButtons from './components/HeaderButtons';
import FindEmail from './page/user/FindEmail';
import TempPassword from './page/user/TempPassword';
import ProtectedRoute from "./components/ProtectedRoute";

import "./css/styles.css";


function App() {
  const location = useLocation();
  const hiddenPaths = ["/login", "/signup"];
  const showHeaderButtons = !hiddenPaths.includes(location.pathname);

  return (
    <div className="container2">
      {showHeaderButtons && <HeaderButtons />}
      <Header />

      <nav className="navbar">
        <ul className="nav-list">
          <li className="nav-item"><Link to="/">홈</Link></li>
          <li className="nav-item"><Link to="/login">로그인</Link></li>
          <li className="nav-item"><Link to="/signup">회원가입</Link></li>
          <li className="nav-item"><Link to="/mypage">마이페이지</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<PostListPage />} />
        <Route path="/posts" element={<PostListPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />

        {/* 로그인 필요 기능은 ProtectedRoute로 감싸기 */}
        <Route path="/posts/write" element={
          <ProtectedRoute>
            <PostFormPage />
          </ProtectedRoute>
        } />
        <Route path="/posts/edit/:id" element={
          <ProtectedRoute>
            <PostFormPage />
          </ProtectedRoute>
        } />
        <Route path="/mypage" element={
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        } />
        <Route path="/edit-profile" element={
          <ProtectedRoute>
            <UserEditPage />
          </ProtectedRoute>
        } />

        {/* 로그인/회원가입/아이디/비번 찾기 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/find-email" element={<FindEmail />} />
        <Route path="/temp-password" element={<TempPassword />} />
        <Route path="/user/email" element={<UserEmail />} />
      </Routes>
      
      <Footer />

    </div>
  );
}

export default App;
