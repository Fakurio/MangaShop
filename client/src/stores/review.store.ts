import { writable } from "svelte/store";
import type { Review, addReviewDto } from "../types/review";
import { usePrivateInterceptor } from "../api/inteceptors/private";

const reviewStore = writable<Review[]>([]);
const reviewStoreResponse = writable("");
const reviewStoreError = writable(false);

const fetchReviews = async (manga_id: number) => {
  try {
    reviewStoreError.set(false);

    let response = await fetch(`http://localhost:3000/review/${manga_id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }

    let reviews = await response.json();
    reviewStore.set(reviews);
  } catch (e: any) {
    reviewStoreError.set(true);
    reviewStoreResponse.set(e.message);
  }
};

const addReview = async (review: addReviewDto) => {
  try {
    reviewStoreError.set(false);

    let response = await usePrivateInterceptor("review/add", "POST", review);

    if (!response.ok) {
      let err = await response.json();
      throw new Error(err.message);
    }

    let msg = await response.json();
    fetchReviews(review.manga_id);
    reviewStoreResponse.set(msg.message);
  } catch (e: any) {
    reviewStoreError.set(true);
    reviewStoreResponse.set(e.message);
  }
};

export {
  reviewStore,
  reviewStoreResponse,
  reviewStoreError,
  fetchReviews,
  addReview,
};
