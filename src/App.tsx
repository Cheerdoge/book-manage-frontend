import { BrowserRouter, Routes, Route, Navigate, Link, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Books from "./pages/Books";
import History from "./pages/History";
import AdminHistory from "./pages/AdminHistory";
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/login" />;
}
function Layout() {
  const role = localStorage.getItem("role");
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };
  return (
    <div>
      <nav style={{ padding: 10, borderBottom: "1px solid #ccc" }}>
        <Link to="/books">图书列表</Link>
        {" | "}
        <Link to="/history">我的借阅</Link>
        {role === "admin" && (
          <>
            {" | "}
            <Link to="/admin/history">全部记录</Link>
          </>
        )}
        <button onClick={handleLogout} style={{ marginLeft: 20 }}>
          退出登录
        </button>
      </nav>
      <div style={{ padding: 20 }}>
        <Outlet />
      </div>
    </div>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/books" element={<Books />} />
          <Route path="/history" element={<History />} />
          <Route path="/admin/history" element={<AdminHistory />} />
        </Route>
        <Route path="*" element={<Navigate to="/books" />} />
      </Routes>
    </BrowserRouter>
  );
}