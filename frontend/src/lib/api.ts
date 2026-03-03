import type { CreateProductData, UpdateProductData } from "#/types/products";
import type { SyncUserData } from "#/types/users";
import api from "./axios";

//Users API
export const syncUser = async (userData: SyncUserData) => {
  try {
    const { data } = await api.post("/users/sync", userData);
    console.log("Syc response: ", data);

    return data;
  } catch (error) {
    console.log("Status: ", error.response?.status);
    console.log("Message: ", error.response?.data);
    throw error;
  }
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
  const { data } = await api.post("/products/my", productData);
  return data;
};

export const updateProduct = async ({
  productData,
  id,
}: {
  productData: UpdateProductData;
  id: string;
}) => {
  const { data } = await api.put(`/products/${id}`, productData);
  return data;
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
