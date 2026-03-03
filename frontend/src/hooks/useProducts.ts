import { createProduct, getProducts } from "#/lib/api";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";

export const useProducts = () => {
  const result = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
  return result;
};

export const useCreateProduct = () => {
  const queryClient = new QueryClient();
  const result = useMutation({
    mutationFn: createProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
  return result;
};
