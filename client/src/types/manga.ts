import type { Genre } from "./genre";
import type { Review } from "./review";

export type Manga = {
  manga_id: number;
  title: string;
  description: string;
  img_url: string;
  price: string;
  stock_quantity: number;
  author: string;
  genres: Genre[];
  reviews: Review[];
  fetched: boolean;
};
