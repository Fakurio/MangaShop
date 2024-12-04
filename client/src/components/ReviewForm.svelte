<script lang="ts">
  import { location } from "svelte-spa-router";
  import { authStore } from "../stores/auth.store";
  import { get } from "svelte/store";
  import {addReview, reviewStoreError} from "../stores/review.store";
  import { toast } from "svelte-sonner";
  import {Label} from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Select from "$lib/components/ui/select";
  import ReviewFormSchema, {type ReviewForm} from "../types/review-form";
  import {Button} from "$lib/components/ui/button";
  import * as Alert from "$lib/components/ui/alert/index.js";
  import {getErrorsFromZod} from "../utils/getErrorsFromZod";


  let {isFormVisible} = $props()
  let reviewForm = $state<ReviewForm>({
      content: "",
      rating: "3"
  })
  let reviewFormErrors = $state<Partial<ReviewForm>>({
      rating: "",
      content: ""
  })

  const getMangaIDFromURL = () => {
    let lastDash = $location.lastIndexOf("/");
    return Number.parseInt($location.slice(lastDash + 1));
  };

  const cleanErrors = () => {
      reviewFormErrors = {
          content: "",
          rating: ""
      }
  }

  const handleAddReview = async (e: SubmitEvent) => {
      e.preventDefault();
      const parsedReview = ReviewFormSchema.safeParse(reviewForm)
      const errors = getErrorsFromZod(parsedReview)
      if(errors) {
          reviewFormErrors = errors;
      } else {
        const payload = {
            content: reviewForm.content,
            rating: parseInt(reviewForm.rating),
            manga_id: getMangaIDFromURL(),
            created_at: new Date(),
        };
        await addReview(payload);
        if($reviewStoreError) {
            toast.error("Failed to add review");
        } else {
            toast.success("Review added successfully");
        }
      }
      reviewForm.content = ""
  };
</script>

{#if get(authStore)}
  {#if isFormVisible}
    <form
      class="py-6"
      onsubmit={(e) => handleAddReview(e)}
    >
        <Label for="content" class="text-md">What do you think about this manga?</Label>
        <Textarea id="content" class="mt-2" required bind:value={reviewForm.content} onclick={cleanErrors}/>
        {#if reviewFormErrors.content}
            <Alert.Root class="mt-5" variant="destructive">
                <Alert.Title>{reviewFormErrors.content}</Alert.Title>
            </Alert.Root>
        {/if}
        <div class="mt-4">
            <Label for="rating" class="text-md">Select rating</Label>
            <Select.Root type="single" bind:value={reviewForm.rating}>
                <Select.Trigger class="w-[180px] mt-2">
                    {reviewForm.rating}
                </Select.Trigger>
                <Select.Content>
                    <Select.Item value="1">1</Select.Item>
                    <Select.Item value="2">2</Select.Item>
                    <Select.Item value="3">3</Select.Item>
                    <Select.Item value="4">4</Select.Item>
                    <Select.Item value="5">5</Select.Item>
                </Select.Content>
            </Select.Root>
        </div>
      <Button type="submit" class="mt-4">Submit review</Button>
    </form>
  {/if}
{/if}

