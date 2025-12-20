export type Note = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  location?: {
    latitude: number;
    longitude: number;
  };
};
