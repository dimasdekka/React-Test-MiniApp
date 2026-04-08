import { z } from "zod";

// ─── API Response Types ───

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
  creationAt?: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

// ─── Schema ZOD ───

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { error: "Email wajib diisi" })
    .email({ error: "Format email tidak valid" }),
  password: z.string().min(1, { error: "Password wajib diisi" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const createProductSchema = z.object({
  title: z
    .string()
    .min(1, { error: "Nama produk wajib diisi" })
    .max(150, { error: "Nama produk maksimal 150 karakter" }),
  price: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Harga wajib diisi"
          : "Harga harus berupa angka",
    })
    .min(1, { error: "Harga harus lebih dari 0" }),
  description: z.string().default(""),
  categoryId: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Kategori wajib dipilih"
          : "Kategori wajib dipilih",
    })
    .min(1, { error: "Kategori wajib dipilih" }),
  images: z.string().default(""),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;

// ─── API Request Types ───

export interface CreateProductPayload {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
}

export interface PaginationParams {
  offset: number;
  limit: number;
}
