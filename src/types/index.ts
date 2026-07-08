export interface User {
  id: number;
  username: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
}

export interface Book {
    id: number;
    title: string;
    author: string;
    publisher: string;
    isbn: string;
    category: string;
    status: "available" | "borrowed";
    createdAt: string;
    updatedAt: string;
}

export interface BorrowRecord {
  id: number;
  userId: number;
  bookId: number;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: "active" | "returned";
  bookTitle: string;
  username: string;
}

export interface ApiResponse<T = unknown> {
    code: number;
    message: string;
    data?: T;
}

export interface LoginResponse {
    token: string;
    user: User;
}