import type { CreateProductData, UpdateProductData } from "#/types/products";
import type { SyncUserData } from "#/types/users";
import api from "./axios";

//Users API
export const syncUser = async (userData: SyncUserData) => {
  const { data } = await api.post("/users/sync", userData);

  return data;
};

//Products API
export const getProducts = async () => {
  const { data } = await api.get("/products");
  return data;
};

export const getProduct = async (id: string) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const getMyProducts = async () => {
  const { data } = await api.get("/products/my");
  return data;
};

export const createProduct = async (productData: CreateProductData) => {
  const { data } = await api.post("/products", productData);
  return data;
};

export const updateProduct = async (id: string, data: UpdateProductData) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id: string) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

// Comments API
export const createComment = async ({
  productId,
  content,
}: {
  productId: string;
  content: string;
}) => {
  const { data } = await api.post(`/comments/${productId}`, { content });
  return data;
};

export const deleteComment = async ({ commentId }: { commentId: string }) => {
  const { data } = await api.delete(`/comments/${commentId}`);
  return data;
};
