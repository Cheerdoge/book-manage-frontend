import { useEffect, useState } from "react";
import { getBooks } from "../api/books";
import { borrowBook } from "../api/borrow";
import type { Book } from "../types";
export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [borrowingId, setBorrowingId] = useState<number | null>(null);
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
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="搜索书名或作者"
      />
      <ul>
        {filtered.map((book) => (
          <li key={book.id}>
            《{book.title}》—— {book.author}
            {book.status === "available" ? (
              <button
                onClick={() => handleBorrow(book.id)}
                disabled={borrowingId === book.id}
              >
                {borrowingId === book.id ? "借阅中..." : "借阅"}
              </button>
            ) : (
              <span style={{ color: "gray", marginLeft: 8 }}>❌已借出</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}