import type { User } from "./users";

export type Comment = {
  id: string;
  content: string;
  userId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
};

export type CreateCommentData = {
  content: string;
};
