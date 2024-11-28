<script lang="ts">
  import Button from "./Button.svelte";
  import { location } from "svelte-spa-router";
  import { authStore } from "../stores/auth.store";
  import { get } from "svelte/store";
  import { addReview } from "../stores/review.store";

  let isVisible = false;
  let reviewContent = "";
  let reviewRating = "3";
  let reviewContentError = "";

  const getMangaIDFromURL = () => {
    let lastDash = $location.lastIndexOf("/");
    return Number.parseInt($location.slice(lastDash + 1));
  };

  const handleAddReview = async () => {
    if (!(reviewContent.trim().length > 0)) {
      reviewContentError = "Please fill out this field";
    } else {
      let payload = {
        content: reviewContent,
        rating: Number.parseInt(reviewRating),
        manga_id: getMangaIDFromURL(),
        created_at: new Date(),
      };
      await addReview(payload);
    }
  };
</script>

{#if get(authStore)}
  {#if !isVisible}
    <div class="toggle-review-form">
      <Button
        text="Add review"
        onClick={() => {
          isVisible = !isVisible;
        }}
      />
    </div>
  {:else}
    <form
      class="review-form"
      on:submit|preventDefault={() => handleAddReview()}
    >
      <label for="content">What do you think about this manga?</label><br />
      <textarea
        id="content"
        required
        bind:value={reviewContent}
        on:input={() => (reviewContentError = "")}
      />
      {#if reviewContentError}
        <span class="error">{reviewContentError}</span>
      {/if}
      <div class="review-form__rating">
        <label for="rating">Select rating</label>
        <select id="rating" required bind:value={reviewRating}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <div class="review-form__buttons">
        <Button text="Add review" className="review-form__btn" />
        <Button text="Hide form" onClick={() => (isVisible = !isVisible)} />
      </div>
    </form>
  {/if}
{/if}

<style>
  .toggle-review-form {
    text-align: center;
  }
  .review-form {
    margin-top: 2rem;
    background-color: #383638;
    width: fit-content;
    padding: 1rem;
    border-radius: 0.5rem;
  }

  .review-form :global(.review-form__btn) {
    margin-top: 1rem;
  }

  .review-form textarea {
    display: block;
    width: 300px;
    height: 100px;
    margin-top: 1rem;
    color: black;
  }

  .review-form__rating {
    margin-top: 1rem;
  }

  .review-form__rating select {
    width: 50px;
    margin-left: 0.5rem;
  }

  .review-form__buttons {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  @media (max-width: 400px) {
    .review-form textarea {
      width: 100%;
    }
  }
</style>
