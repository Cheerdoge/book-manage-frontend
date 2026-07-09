import { useEffect, useState } from "react";
import { getAllBorrowHistory, returnBook } from "../api/borrow";
import type { BorrowRecord } from "../types";
import { Table, Tag, Button, Spin, Empty, App as AntdApp } from "antd";

const columns = (
  returningId: number | null,
  onReturn: (id: number) => void
) => [
  {
    title: "借阅人",
    dataIndex: "username",
    key: "username",
    width: 120,
  },
  {
    title: "书名",
    dataIndex: "bookTitle",
    key: "bookTitle",
    render: (title: string) => (
      <span style={{ fontWeight: 500 }}>{title}</span>
    ),
  },
  {
    title: "借阅日期",
    dataIndex: "borrowDate",
    key: "borrowDate",
    width: 120,
  },
  {
    title: "应还日期",
    dataIndex: "dueDate",
    key: "dueDate",
    width: 120,
  },
  {
    title: "归还日期",
    dataIndex: "returnDate",
    key: "returnDate",
    width: 120,
    render: (date: string | null) => date || "—",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 100,
    render: (status: string) =>
      status === "active" ? (
        <Tag color="orange">借阅中</Tag>
      ) : (
        <Tag color="green">已归还</Tag>
      ),
  },
  {
    title: "操作",
    key: "action",
    width: 120,
    render: (_: unknown, record: BorrowRecord) =>
      record.status === "active" ? (
        <Button
          size="small"
          danger
          loading={returningId === record.id}
          onClick={() => onReturn(record.id)}
        >
          强制归还
        </Button>
      ) : null,
  },
];

export default function AdminHistory() {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<number | null>(null);
  const { message } = AntdApp.useApp();

  const loadHistory = () => {
    setLoading(true);
    getAllBorrowHistory()
      .then((res) => {
        setRecords(res.data.data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleReturn = async (recordId: number) => {
    setReturningId(recordId);
    try {
      await returnBook(recordId);
      message.success("强制归还成功");
      loadHistory();
    } catch {
      message.error("归还失败");
    } finally {
      setReturningId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="page-title">全部借阅记录</h2>
      <p className="page-subtitle">共 {records.length} 条记录</p>
      {records.length === 0 ? (
        <Empty description="暂无借阅记录" />
      ) : (
        <Table
          dataSource={records}
          columns={columns(returningId, handleReturn)}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: false }}
          scroll={{ x: 800 }}
        />
      )}
    </div>
  );
}
