import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(username, password);
      const { token, user } = res.data.data!;
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      navigate("/books");
    } catch {
      setError("登录失败");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h1>图书管理系统 - 登录</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="用户名" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="密码" />
      <button type="submit">登录</button>
      <p>没有账号？<Link to="/register">去注册</Link></p>
    </form>
  );
}