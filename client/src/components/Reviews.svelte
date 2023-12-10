<script lang="ts">
  import type { Review } from "../types/review";

  export let reviewsList: Review[] = [
    {
      review_id: 1,
      content: "Bardzo dobrze jeszcze jak",
      rating: 5,
      user_id: 1,
      created_at: new Date("2023-12-10"),
    },
  ];
</script>

<section class="reviews">
  <h1>Reviews</h1>
  {#each reviewsList as review (review.review_id)}
    <div class="review">
      <p>{review.rating}</p>
      <p>{review.content}</p>
      <p>
        {review.user_id}, {review.created_at.getDate()}.{review.created_at.getMonth() +
          1}.{review.created_at.getFullYear()}
      </p>
    </div>
  {/each}
</section>
