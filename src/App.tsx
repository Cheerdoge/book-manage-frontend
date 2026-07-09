import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import type { MenuProps } from "antd";
import { ConfigProvider, Layout, Menu, Button, App as AntdApp } from "antd";
import "./App.css";
import {
  BookOutlined,
  HistoryOutlined,
  TeamOutlined,
  LogoutOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Books from "./pages/Books";
import History from "./pages/History";
import AdminHistory from "./pages/AdminHistory";
import Users from "./pages/Users";

const { Header, Sider, Content } = Layout;

const theme = {
  token: {
    colorPrimary: "#D97706",
    borderRadius: 8,
    colorBgLayout: "#F1F5F9",
    colorBgContainer: "#FFFFFF",
    colorText: "#0F172A",
    colorTextSecondary: "#475569",
    colorBorder: "#E2E8F0",
    colorBorderSecondary: "#F1F5F9",
    colorError: "#DC2626",
    colorSuccess: "#16A34A",
    colorWarning: "#D97706",
    colorTextPlaceholder: "#94A3B8",
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontFamilyCode: '"JetBrains Mono", ui-monospace, monospace',
    controlHeight: 36,
    paddingContentHorizontal: 24,
    paddingContentVertical: 20,
  },
  components: {
    Menu: {
      darkItemBg: "#0F172A",
      darkSubMenuItemBg: "#0F172A",
      darkItemSelectedBg: "rgba(217, 119, 6, 0.15)",
      darkItemSelectedColor: "#F59E0B",
    },
    Table: {
      headerBg: "#F8FAFC",
      headerColor: "#475569",
      rowHoverBg: "#F8FAFC",
      borderColor: "#E2E8F0",
    },
    Button: {
      primaryShadow: "none",
    },
    Tag: {
      defaultBg: "#F1F5F9",
      defaultColor: "#475569",
    },
    Card: {
      paddingLG: 20,
    },
  },
};

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/books" replace /> : <>{children}</>;
}

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const menuItems = [
    { key: "books", icon: <BookOutlined />, label: "藏书管理", path: "/books" },
    {
      key: "history",
      icon: <HistoryOutlined />,
      label: "我的借阅",
      path: "/history",
    },
    ...(isAdmin
      ? [
          {
            key: "admin-history",
            icon: <OrderedListOutlined />,
            label: "全部记录",
            path: "/admin/history",
          },
          {
            key: "admin-users",
            icon: <TeamOutlined />,
            label: "用户管理",
            path: "/admin/users",
          },
        ]
      : []),
  ];

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    const item = menuItems.find((m) => m.key === key);
    if (item) navigate(item.path);
  };

  const currentPath = location.pathname;
  const selectedKey =
    menuItems.find((m) => currentPath === m.path || currentPath.startsWith(m.path + "/"))
      ?.key ?? "books";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth={0}
        theme="dark"
        width={220}
        style={{ background: "#0F172A" }}
      >
        <div className="sider-brand">
          <span>馆藏</span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          items={menuItems.map(({ key, icon, label }) => ({
            key,
            icon,
            label,
          }))}
          style={{ borderInlineEnd: "none" }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: 0,
            right: 0,
            padding: "0 16px",
          }}
        >
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            block
            style={{ color: "#94A3B8", justifyContent: "flex-start" }}
          >
            退出登录
          </Button>
        </div>
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            borderBottom: "1px solid #E2E8F0",
            height: 56,
            lineHeight: "56px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 500,
              color: "#475569",
            }}
          >
            {menuItems.find((m) => m.key === selectedKey)?.label ?? "藏书管理"}
          </h1>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 13, color: "#94A3B8" }}>
            {role === "admin" ? "管理员" : "用户"}
          </span>
        </Header>
        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default function App() {
  return (
    <ConfigProvider theme={theme}>
      <AntdApp>
        <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/books" element={<Books />} />
            <Route path="/history" element={<History />} />
            <Route path="/admin/history" element={<AdminHistory />} />
            <Route path="/admin/users" element={<Users />} />
          </Route>
          <Route path="*" element={<Navigate to="/books" replace />} />
        </Routes>
      </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  );
}
