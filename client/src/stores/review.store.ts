import { writable } from "svelte/store";
import type { Review, addReviewDto } from "../types/review";
import { catchError } from "../api/catchError";
import { makeRequest } from "../api/makeRequest";
import { makePrivateRequest } from "../api/makePrivateRequest";
import { UnauthorizedError } from "../api/errors/UnauthorizedError";
import { authStore } from "./auth.store";
import cartStore from "./cart.store";
import { replace } from "svelte-spa-router";

const reviewStore = writable<Review[]>([]);
const reviewStoreError = writable(false);

const fetchReviews = async (manga_id: number) => {
  const [error, data] = await catchError<Review[]>(
    makeRequest(`/review/${manga_id}`, "GET"),
  );

  if (error) {
    reviewStoreError.set(true);
  } else {
    reviewStore.set(data);
  }
};

const addReview = async (review: addReviewDto) => {
  reviewStoreError.set(false);
  const [error, _] = await catchError(
    makePrivateRequest("/review", "POST", undefined, review),
  );

  if (error) {
    if (error instanceof UnauthorizedError) {
      authStore.set(null);
      cartStore.set([]);
      await replace("/login");
    } else {
      reviewStoreError.set(true);
    }
  } else {
    await fetchReviews(review.manga_id);
  }
};

export { reviewStore, reviewStoreError, fetchReviews, addReview };
