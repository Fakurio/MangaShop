<script lang="ts">
  import { link } from "svelte-spa-router";
  import { addToCart } from "../stores/cart.store";
  import {Skeleton} from "$lib/components/ui/skeleton";
  import {onMount} from "svelte";
  import {Button} from "$lib/components/ui/button";
  import {toast} from "svelte-sonner";

  interface MangaCardProps  {
    title: string;
    img_url: string;
    price: number;
    manga_id: number;
    handleCardLoad: (title: string) => void
  }

  let {title, img_url, price, manga_id, handleCardLoad} : MangaCardProps = $props()
  let isLoading = $state(true)

  const handleAddingToCart = () => {
    toast.success("Manga added to cart")
    addToCart({manga_id, quantity: 1})
  }

  onMount(() => {
    const img = new Image();
    img.src = img_url;
    isLoading = true;

    img.onload = () => {
      isLoading = false;
      handleCardLoad(title)
    };
  })

</script>

<div class="bg-card border-2 border-border p-6 rounded-3xl w-[300px] relative min-h-80">
  {#if isLoading}
    <Skeleton class="absolute inset-5"/>
  {:else}
    <a href="/manga/{manga_id}" class="hover:text-primary" use:link>
      <div class="manga-card">
        <img src={img_url}  class="rounded-3xl h-full w-full" alt={title}/>
        <h2 class="mt-4 text-xl ">{title}</h2>
      </div>
    </a>
    <div class="mt-2 flex justify-between items-center">
      <span class="text-lg font-bold">{price} PLN</span>
      <Button class="w-3/5" onclick={handleAddingToCart}>Buy</Button>
    </div>
  {/if}
</div>

<style>
  .manga-card {
    display: grid;
    grid-template-rows: 340px 70px;
  }
</style>
