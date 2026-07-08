import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/auth";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (username.length < 3) {
      setError("用户名至少3个字符");
      return;
    }
    if (password.length < 6) {
      setError("密码至少6个字符");
      return;
    }
    try {
      await register(username, password);
      alert("注册成功，请登录");
      navigate("/login");
    } catch {
      setError("注册失败，用户名可能已存在");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>注册</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="用户名（至少3个字符）"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="密码（至少6个字符）"
      />
      <button type="submit">注册</button>
      <p>
        已有账号？<Link to="/login">去登录</Link>
      </p>
    </form>
  );
}
