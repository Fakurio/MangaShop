<script lang="ts">
  import type { Review } from "../types/review";
  import Rating from "./Rating.svelte";

  export let reviewsList: Review[] = [
    {
      review_id: 1,
      content: "Bardzo dobrze jeszcze jak",
      rating: 2,
      user_id: 1,
      created_at: new Date("2023-12-10"),
    },
    {
      review_id: 2,
      content: "Bardzo dobrze jeszcze jak",
      rating: 4,
      user_id: 1,
      created_at: new Date("2023-12-10"),
    },
  ];
</script>

<section class="reviews">
  <h2 class="reviews__heading">Reviews</h2>
  {#if reviewsList.length === 0}
    <p class="reviews__error">There is no reviews yet</p>
  {:else}
    {#each reviewsList as review (review.review_id)}
      <div class="reviews__review">
        <Rating rating={review.rating} />
        <p class="review__content">{review.content}</p>
        <p class="review__date">
          {review.user_id}, {review.created_at.getDate()}.{review.created_at.getMonth() +
            1}.{review.created_at.getFullYear()}
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
