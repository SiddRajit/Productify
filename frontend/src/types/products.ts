export type Product = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProductData = {
  title: string;
  description: string;
  imageUrl: string;
};

export type UpdateProductData = Partial<CreateProductData>;
