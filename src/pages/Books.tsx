import { useEffect, useState, type FormEvent } from "react";
import { getBooks, createBook, updateBook, deleteBook } from "../api/books";
import { borrowBook } from "../api/borrow";
import type { Book } from "../types";

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [borrowingId, setBorrowingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [formPublisher, setFormPublisher] = useState("");
  const [formIsbn, setFormIsbn] = useState("");
  const [formCategory, setFormCategory] = useState("");

  const loadBooks = () => {
    setLoading(true);
    getBooks().then((res) => {
      setBooks(res.data.data ?? []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const openAddForm = () => {
    setEditingBook(null);
    setFormTitle("");
    setFormAuthor("");
    setFormPublisher("");
    setFormIsbn("");
    setFormCategory("");
    setShowForm(true);
  };

  const openEditForm = (book: Book) => {
    setEditingBook(book);
    setFormTitle(book.title);
    setFormAuthor(book.author);
    setFormPublisher(book.publisher);
    setFormIsbn(book.isbn);
    setFormCategory(book.category);
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert("书名不能为空");
      return;
    }
    try {
      const data = {
        title: formTitle.trim(),
        author: formAuthor.trim(),
        publisher: formPublisher.trim(),
        isbn: formIsbn.trim(),
        category: formCategory.trim(),
      };
      if (editingBook) {
        await updateBook(editingBook.id, data);
        alert("修改成功");
      } else {
        await createBook(data);
        alert("添加成功");
      }
      setShowForm(false);
      loadBooks();
    } catch {
      alert(editingBook ? "修改失败" : "添加失败");
    }
  };

  const handleDelete = async (bookId: number, title: string) => {
    if (!window.confirm(`确认删除《${title}》？`)) return;
    setDeletingId(bookId);
    try {
      await deleteBook(bookId);
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
    } catch {
      alert("删除失败");
    } finally {
      setDeletingId(null);
    }
  };

  const handleBorrow = async (bookId: number) => {
    setBorrowingId(bookId);
    try {
      await borrowBook(bookId);
      alert("借阅成功");
      loadBooks();
    } catch {
      alert("借阅失败，可能已被借出");
    } finally {
      setBorrowingId(null);
    }
  };

  const filtered = books.filter(
    (b) => b.title.includes(search) || b.author.includes(search)
  );

  if (loading) return <p>加载中...</p>;

  return (
    <div>
      <h1>图书列表</h1>

      <div style={{ marginBottom: 12 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索书名或作者"
        />
        {isAdmin && (
          <button onClick={openAddForm} style={{ marginLeft: 8 }}>
            添加图书
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            border: "1px solid #ccc",
            padding: 16,
            marginBottom: 16,
            background: "#f9f9f9",
          }}
        >
          <h3>{editingBook ? `编辑《${editingBook.title}》` : "添加新书"}</h3>
          <div>
            <label>书名 *</label>
            <input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>作者</label>
            <input
              value={formAuthor}
              onChange={(e) => setFormAuthor(e.target.value)}
            />
          </div>
          <div>
            <label>出版社</label>
            <input
              value={formPublisher}
              onChange={(e) => setFormPublisher(e.target.value)}
            />
          </div>
          <div>
            <label>ISBN</label>
            <input
              value={formIsbn}
              onChange={(e) => setFormIsbn(e.target.value)}
            />
          </div>
          <div>
            <label>分类</label>
            <input
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
            />
          </div>
          <div style={{ marginTop: 8 }}>
            <button type="submit">{editingBook ? "保存" : "添加"}</button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{ marginLeft: 8 }}
            >
              取消
            </button>
          </div>
        </form>
      )}

      <ul>
        {filtered.map((book) => (
          <li key={book.id}>
            《{book.title}》—— {book.author}
            {book.category && ` [${book.category}]`}
            {book.status === "available" ? (
              <button
                onClick={() => handleBorrow(book.id)}
                disabled={borrowingId === book.id}
                style={{ marginLeft: 8 }}
              >
                {borrowingId === book.id ? "借阅中..." : "借阅"}
              </button>
            ) : (
              <span style={{ color: "gray", marginLeft: 8 }}>❌已借出</span>
            )}
            {isAdmin && (
              <>
                <button
                  onClick={() => openEditForm(book)}
                  style={{ marginLeft: 8 }}
                >
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(book.id, book.title)}
                  disabled={deletingId === book.id}
                  style={{ marginLeft: 4, color: "red" }}
                >
                  {deletingId === book.id ? "删除中..." : "删除"}
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
