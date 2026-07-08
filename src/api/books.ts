import client from "./client";

import type { ApiResponse, Book } from "../types";

export const getBooks = (params?: { title?: string; author?: string; category?: string }) =>
  client.get<ApiResponse<Book[]>>("/books", { params });

export const getBook = (id: number) =>
  client.get<ApiResponse<Book>>(`/books/${id}`);

export const createBook = (data: Omit<Book, "id" | "status" | "createdAt" | "updatedAt">) =>
  client.post<ApiResponse<Book>>("/books", data);

export const updateBook = (id: number, data: Partial<Book>) =>
  client.put<ApiResponse<Book>>(`/books/${id}`, data);

export const deleteBook = (id: number) =>
  client.delete<ApiResponse>(`/books/${id}`);