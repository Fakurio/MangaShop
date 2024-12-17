<script lang="ts">
  import Rating from "./Rating.svelte";
  import ReviewForm from "./ReviewForm.svelte";
  import { formatDate } from "../utils/formatDate";
  import {
    reviewStore,
    fetchReviews,
  } from "../stores/review.store";
  import { onMount } from "svelte";
  import {Button} from "$lib/components/ui/button";
  import * as Alert from "$lib/components/ui/alert/index.js";
  import {authStore} from "../stores/auth.store";

  let { manga_id } : { manga_id: number } = $props()
  let isFormVisible = $state<boolean>(false)

  onMount(async () => {
    await fetchReviews(manga_id);
  });
</script>

<section class="bg-card border-2 border-border rounded-3xl mt-16 p-6">
  <h2 class="text-4xl">Reviews</h2>
  {#if $authStore}
    <Button class="mt-4" onclick={() => {isFormVisible = !isFormVisible}} variant="secondary">
      {isFormVisible ? "Hide form" : "Add review"}
    </Button>
  {/if}
  {#if $reviewStore.length === 0}
    <ReviewForm {isFormVisible}/>
    <Alert.Root class="text-center mt-5 border-border border-2">
      <Alert.Title>There is no reviews yet</Alert.Title>
    </Alert.Root>
  {:else}
    <ReviewForm {isFormVisible}/>
    {#each $reviewStore as review (review.review_id)}
      <div class="border-2 border-secondary rounded-lg mt-8 p-4">
        <Rating rating={review.rating} />
        <p class="mt-4">{review.content}</p>
        <p class="mt-4 text-right">
          {review.user_id.name}, {formatDate(review.created_at)}
        </p>
      </div>
    {/each}
  {/if}
</section>
