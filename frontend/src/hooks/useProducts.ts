import {
  createProduct,
  deleteProduct,
  getMyProducts,
  getProduct,
  getProducts,
  updateProduct,
} from "#/lib/api";
import type { UpdateProductData } from "#/types/products";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    enabled: !!id,
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["my-products"] });
    },
  });
};

export const useMyProducts = () => {
  return useQuery({
    queryKey: ["my-products"],
    queryFn: getMyProducts,
  });
};

export const useUpdateProduct = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProductData) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
    },
  });
};
