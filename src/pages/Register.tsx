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
import { register } from "../api/auth";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    if (values.username.length < 3) {
      message.warning("用户名至少 3 个字符");
      return;
    }
    if (values.password.length < 6) {
      message.warning("密码至少 6 个字符");
      return;
    }
    setLoading(true);
    try {
      await register(values.username, values.password);
      message.success("注册成功，请登录");
      navigate("/login");
    } catch {
      message.error("注册失败，用户名可能已存在");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card" styles={{ body: { padding: 40 } }}>
        <div className="login-brand">
          <h1>馆藏</h1>
          <p>创建新账号</p>
        </div>
        <Form onFinish={handleSubmit} size="large" autoComplete="off">
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "请输入用户名" },
              { min: 3, message: "用户名至少 3 个字符" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名（至少 3 个字符）" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "请输入密码" },
              { min: 6, message: "密码至少 6 个字符" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码（至少 6 个字符）"
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              注册
            </Button>
          </Form.Item>
          <div style={{ textAlign: "center" }}>
            <span style={{ color: "#64748b", fontSize: 13 }}>
              已有账号？{" "}
            </span>
            <Link
              to="/login"
              style={{ fontSize: 13, color: "#D97706" }}
            >
              去登录
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
