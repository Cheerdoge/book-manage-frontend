import { useEffect, useState } from "react";
import { getAllBorrowHistory, returnBook } from "../api/borrow";
import type { BorrowRecord } from "../types";
export default function AdminHistory() {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<number | null>(null);
  const loadHistory = () => {
    setLoading(true);
    getAllBorrowHistory().then((res) => {
      setRecords(res.data.data ?? []);
      setLoading(false);
    });
  };
  useEffect(() => {
    loadHistory();
  }, []);
  const handleReturn = async (recordId: number) => {
    setReturningId(recordId);
    try {
      await returnBook(recordId);
      alert("强制归还成功");
      loadHistory();
    } catch {
      alert("归还失败");
    } finally {
      setReturningId(null);
    }
  };
  if (loading) return <p>加载中...</p>;
  return (
    <div>
      <h1>全部借阅记录（管理员）</h1>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>借阅人</th>
            <th>书名</th>
            <th>借阅日期</th>
            <th>应还日期</th>
            <th>归还日期</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>{r.username}</td>
              <td>《{r.bookTitle}》</td>
              <td>{r.borrowDate}</td>
              <td>{r.dueDate}</td>
              <td>{r.returnDate ?? "—"}</td>
              <td style={{ color: r.status === "active" ? "orange" : "green" }}>
                {r.status === "active" ? "借阅中" : "已归还"}
              </td>
              <td>
                {r.status === "active" && (
                  <button
                    onClick={() => handleReturn(r.id)}
                    disabled={returningId === r.id}
                  >
                    {returningId === r.id ? "归还中..." : "强制归还"}
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