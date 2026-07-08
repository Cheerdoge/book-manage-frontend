import client from "./client";
import type { ApiResponse, LoginResponse, User } from "../types";

export const login = (username: string, password: string) =>
    client.post<ApiResponse<LoginResponse>>("/users/login", {username, password});

export const register = (username: string, password: string) =>
  client.post<ApiResponse<User>>("/users/register", { username, password });

export const getUsers = () =>
  client.get<ApiResponse<User[]>>("/users");

export const getUser = (id: number) =>
  client.get<ApiResponse<User>>(`/users/${id}`);

export const updateUserRole = (userId: number, role: "admin" | "user") =>
  client.put<ApiResponse>(`/users/${userId}/role`, { role });