export type SyncUserData = {
  email: string;
  name?: string | null;
  imageUrl?: string | null;
};

export type User = {
  id: string;
  name: string;
  imageUrl: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};
