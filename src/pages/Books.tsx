import { useEffect, useState } from "react";
import { getBooks, createBook, updateBook, deleteBook } from "../api/books";
import { borrowBook } from "../api/borrow";
import type { Book } from "../types";
import {
  Input,
  Button,
  Modal,
  Form,
  Tag,
  Spin,
  Empty,
  App as AntdApp,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  SearchOutlined,
} from "@ant-design/icons";

function categoryColor(category: string): string {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 38%, 42%)`;
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [borrowingId, setBorrowingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [form] = Form.useForm();
  const { message } = AntdApp.useApp();

  const loadBooks = () => {
    setLoading(true);
    getBooks()
      .then((res) => {
        setBooks(res.data.data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const openAddModal = () => {
    setEditingBook(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    form.setFieldsValue(book);
    setModalOpen(true);
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        title: values.title.trim(),
        author: values.author.trim(),
        publisher: values.publisher.trim(),
        isbn: values.isbn.trim(),
        category: values.category.trim(),
      };
      if (editingBook) {
        await updateBook(editingBook.id, data);
        message.success("修改成功");
      } else {
        await createBook(data);
        message.success("添加成功");
      }
      setModalOpen(false);
      form.resetFields();
      loadBooks();
    } catch {
      if (editingBook) message.error("修改失败");
      else message.error("添加失败");
    }
  };

  const handleDelete = async (bookId: number, title: string) => {
    setDeletingId(bookId);
    try {
      await deleteBook(bookId);
      message.success(`已删除《${title}》`);
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
    } catch {
      message.error("删除失败");
    } finally {
      setDeletingId(null);
    }
  };

  const handleBorrow = async (bookId: number) => {
    setBorrowingId(bookId);
    try {
      await borrowBook(bookId);
      message.success("借阅成功");
      loadBooks();
    } catch {
      message.error("借阅失败，可能已被借出");
    } finally {
      setBorrowingId(null);
    }
  };

  const filtered = books.filter(
    (b) =>
      b.title.includes(search) ||
      b.author.includes(search) ||
      b.isbn.includes(search)
  );

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 className="page-title">藏书管理</h2>
        <p className="page-subtitle">
          共 {books.length} 册藏书，{books.filter((b) => b.status === "available").length}{" "}
          册可借
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <Input
          prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
          placeholder="搜索书名、作者或 ISBN"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ flex: 1, minWidth: 220 }}
        />
        {isAdmin && (
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            添加图书
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <Empty description={search ? "未找到匹配的图书" : "暂未添加图书"} />
      ) : (
        <div className="book-grid">
          {filtered.map((book) => (
            <div key={book.id} className="book-card">
              <span
                className="spine-stripe"
                style={{
                  background: book.category
                    ? categoryColor(book.category)
                    : "#e2e8f0",
                }}
              />
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">
                {book.author || "作者不详"}
                {book.publisher && ` · ${book.publisher}`}
              </p>
              <p className="book-meta">
                {book.isbn && <span>{book.isbn}</span>}
                {book.category && (
                  <Tag style={{ margin: 0, fontSize: 11 }}>{book.category}</Tag>
                )}
              </p>
              <div className="book-footer">
                <span
                  style={{
                    fontSize: 13,
                    color: book.status === "available" ? "#16A34A" : "#94A3B8",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span
                    className={`status-dot ${book.status}`}
                  />
                  {book.status === "available" ? "可借阅" : "已借出"}
                </span>
                <div className="actions">
                  {book.status === "available" && (
                    <Button
                      size="small"
                      type="primary"
                      icon={<BookOutlined />}
                      loading={borrowingId === book.id}
                      onClick={() => handleBorrow(book.id)}
                    >
                      借阅
                    </Button>
                  )}
                  {isAdmin && (
                    <>
                      <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(book)}
                      />
                      <Popconfirm
                        title={`确认删除《${book.title}》？`}
                        onConfirm={() => handleDelete(book.id, book.title)}
                        okText="确认删除"
                        cancelText="取消"
                        okButtonProps={{ danger: true }}
                      >
                        <Button
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          loading={deletingId === book.id}
                        />
                      </Popconfirm>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title={editingBook ? `编辑《${editingBook.title}》` : "添加新书"}
        open={modalOpen}
        onOk={handleFormSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editingBook ? "保存" : "添加"}
        cancelText="取消"
        destroyOnClose
        width={520}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="title"
            label="书名"
            rules={[{ required: true, message: "书名不能为空" }]}
          >
            <Input placeholder="请输入书名" />
          </Form.Item>
          <Form.Item name="author" label="作者">
            <Input placeholder="请输入作者" />
          </Form.Item>
          <Form.Item name="publisher" label="出版社">
            <Input placeholder="请输入出版社" />
          </Form.Item>
          <Form.Item name="isbn" label="ISBN">
            <Input placeholder="请输入 ISBN" style={{ fontFamily: "'JetBrains Mono', monospace" }} />
          </Form.Item>
          <Form.Item name="category" label="分类">
            <Input placeholder="如：文学、科技、历史" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
