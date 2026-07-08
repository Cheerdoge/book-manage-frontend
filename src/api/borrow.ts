import client from "./client";
import type { ApiResponse, BorrowRecord } from "../types";

export const borrowBook = (bookId: number) =>
    client.post<ApiResponse>("/borrow", { bookId });

export const returnBook = (recordId: number) =>
    client.put<ApiResponse>(`/borrow/${recordId}/return`);

export const getMyBorrowHistory = () =>
    client.get<ApiResponse<BorrowRecord[]>>("/borrow/history");

export const getAllBorrowHistory = () =>
    client.get<ApiResponse<BorrowRecord[]>>("/borrow/history/all");