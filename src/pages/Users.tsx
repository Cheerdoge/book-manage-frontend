import { useEffect, useState } from "react";
import { getUsers, updateUserRole } from "../api/auth";
import type { User } from "../types";
import {
  Table,
  Tag,
  Button,
  Spin,
  Empty,
  App as AntdApp,
  Popconfirm,
} from "antd";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [changingId, setChangingId] = useState<number | null>(null);
  const { message } = AntdApp.useApp();

  const loadUsers = () => {
    setLoading(true);
    getUsers()
      .then((res) => {
        setUsers(res.data.data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (
    userId: number,
    newRole: "admin" | "user",
    username: string
  ) => {
    setChangingId(userId);
    try {
      await updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      message.success(
        newRole === "admin"
          ? `已将 ${username} 设为管理员`
          : `已取消 ${username} 的管理员权限`
      );
    } catch {
      message.error("修改失败");
    } finally {
      setChangingId(null);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      render: (name: string) => (
        <span style={{ fontWeight: 500 }}>{name}</span>
      ),
    },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role: string) =>
        role === "admin" ? (
          <Tag color="gold">管理员</Tag>
        ) : (
          <Tag>用户</Tag>
        ),
    },
    {
      title: "注册时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
    },
    {
      title: "操作",
      key: "action",
      width: 140,
      render: (_: unknown, record: User) =>
        record.role === "user" ? (
          <Popconfirm
            title={`确认将 ${record.username} 设为管理员？`}
            onConfirm={() =>
              handleRoleChange(record.id, "admin", record.username)
            }
            okText="确认"
            cancelText="取消"
          >
            <Button
              size="small"
              type="primary"
              loading={changingId === record.id}
            >
              设为管理员
            </Button>
          </Popconfirm>
        ) : (
          <Popconfirm
            title={`确认取消 ${record.username} 的管理员权限？`}
            onConfirm={() =>
              handleRoleChange(record.id, "user", record.username)
            }
            okText="确认"
            cancelText="取消"
          >
            <Button
              size="small"
              danger
              loading={changingId === record.id}
            >
              取消管理员
            </Button>
          </Popconfirm>
        ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="page-title">用户管理</h2>
      <p className="page-subtitle">
        共 {users.length} 位用户，{users.filter((u) => u.role === "admin").length}{" "}
        位管理员
      </p>
      {users.length === 0 ? (
        <Empty description="暂无用户" />
      ) : (
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: false }}
        />
      )}
    </div>
  );
}
