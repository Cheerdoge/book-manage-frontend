import { useEffect, useState } from "react";
import { getUsers, updateUserRole } from "../api/auth";
import type { User } from "../types";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [changingId, setChangingId] = useState<number | null>(null);

  const loadUsers = () => {
    setLoading(true);
    getUsers().then((res) => {
      setUsers(res.data.data ?? []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: number, newRole: "admin" | "user") => {
    setChangingId(userId);
    try {
      await updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch {
      alert("修改失败");
    } finally {
      setChangingId(null);
    }
  };

  if (loading) return <p>加载中...</p>;

  return (
    <div>
      <h1>用户管理（管理员）</h1>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>角色</th>
            <th>注册时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>{u.createdAt}</td>
              <td>
                {u.role === "user" ? (
                  <button
                    onClick={() => handleRoleChange(u.id, "admin")}
                    disabled={changingId === u.id}
                  >
                    {changingId === u.id ? "处理中..." : "设为管理员"}
                  </button>
                ) : (
                  <button
                    onClick={() => handleRoleChange(u.id, "user")}
                    disabled={changingId === u.id}
                  >
                    {changingId === u.id ? "处理中..." : "取消管理员"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
