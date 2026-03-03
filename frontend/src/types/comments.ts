export type Comment = {
  id: string;
  content: string;
  userId: string;
  productId: string;
  createdAt: Date;
};

export type CreateCommentData = {
  content: string;
};
