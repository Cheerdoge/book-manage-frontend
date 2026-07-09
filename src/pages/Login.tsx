import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Card,
  App as AntdApp,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { login } from "../api/auth";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();

  const handleSubmit = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const res = await login(values.username, values.password);
      const { token, user } = res.data.data!;
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      message.success("登录成功");
      navigate("/books", { replace: true });
    } catch {
      message.error("用户名或密码错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card" styles={{ body: { padding: 40 } }}>
        <div className="login-brand">
          <h1>馆藏</h1>
          <p>图书管理系统</p>
        </div>
        <Form onFinish={handleSubmit} size="large" autoComplete="off">
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              onPressEnter={() => {}}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              登录
            </Button>
          </Form.Item>
          <div style={{ textAlign: "center" }}>
            <span style={{ color: "#64748b", fontSize: 13 }}>
              没有账号？{" "}
            </span>
            <Link
              to="/register"
              style={{ fontSize: 13, color: "#D97706" }}
            >
              注册
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
