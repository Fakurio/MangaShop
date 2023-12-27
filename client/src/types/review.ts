export type Review = {
  review_id: number;
  content: string;
  user_id: { name: string };
  rating: number;
  created_at: Date;
};

export type addReviewDto = Omit<Review, "review_id" | "user_id"> & {
  manga_id: number;
};
