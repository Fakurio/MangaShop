<script lang="ts">
  import Rating from "./Rating.svelte";
  import ReviewForm from "./ReviewForm.svelte";
  import { formatDate } from "../utils/formatDate";
  import {
    reviewStore,
    fetchReviews,
    reviewStoreResponse,
    reviewStoreError,
  } from "../stores/review.store";
  import { onDestroy, onMount } from "svelte";

  export let manga_id: number;

  onMount(async () => {
    await fetchReviews(manga_id);
  });

  onDestroy(() => {
    reviewStoreError.set(false);
    reviewStoreResponse.set("");
  });
</script>




{#if $reviewStoreResponse}
    <p
        class={`server-response ${
          $reviewStoreError ? "server-response--error" : undefined
        }`}
    >
      {$reviewStoreResponse}
    </p>
{/if}
  <section class="reviews">
    <h2 class="reviews__heading">Reviews</h2>
    {#if $reviewStore.length === 0}
      <p class="reviews__error">There is no reviews yet</p>
      <ReviewForm />
    {:else}
      <ReviewForm />
      {#each $reviewStore as review (review.review_id)}
        <div class="reviews__review">
          <Rating rating={review.rating} />
          <p class="review__content">{review.content}</p>
          <p class="review__date">
            {review.user_id.name}, {formatDate(review.created_at)}
          </p>
        </div>
      {/each}
    {/if}
  </section>

<style>
  .reviews {
    background-color: #282628;
    color: white;
    grid-column: 1 / -1;
    margin-top: 4rem;
    border-radius: 1rem;
    padding-inline: 1rem;
    padding-bottom: 1.5rem;
  }

  .reviews__heading {
    text-align: center;
    font-size: 2rem;
    margin-top: 1rem;
  }

  .reviews__review {
    background-color: #383638;
    border-radius: 0.5rem;
    margin-top: 2rem;
    padding: 1.5rem;
  }

  .review__content {
    margin-top: 1rem;
  }

  .review__date {
    margin-top: 1rem;
    text-align: right;
  }

  .reviews__error {
    text-align: center;
    color: rgb(184, 40, 40);
    font-size: 1.2rem;
    font-weight: 700;
    margin-top: 2rem;
  }
</style>
