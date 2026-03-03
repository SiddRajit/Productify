import type { Comment } from "./comments";
import type { User } from "./users";

export type Product = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  comments?: Comment[];
};
export type CreateProductData = {
  title: string;
  description: string;
  imageUrl: string;
};

export type UpdateProductData = Partial<CreateProductData>;
