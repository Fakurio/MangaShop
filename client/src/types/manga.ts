import type { Genre } from "./genre";
import type { Review } from "./review";

export type Manga = {
  manga_id: number;
  title: string;
  description: string;
  img_url: string;
  price: number;
  stock_quantity: number;
  genres: Genre[];
  reviews: Review[];
};
