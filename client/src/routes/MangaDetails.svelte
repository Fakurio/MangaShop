<script lang="ts">
  import {fetchMangaDetails, fetchMangas, serverError} from "../stores/manga.store";
  import { mangaStore } from "../stores/manga.store";
  import { onDestroy } from "svelte";
  import type { Manga } from "../types/manga";
  import Header from "../components/Header.svelte";
  import Reviews from "../components/Reviews.svelte";
  import * as Alert from "$lib/components/ui/alert";
  import { addToCart } from "../stores/cart.store";
  import {Skeleton} from "$lib/components/ui/skeleton";
  import {Button, buttonVariants} from "$lib/components/ui/button";
  import {Input} from "$lib/components/ui/input";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Toaster } from "$lib/components/ui/sonner";

  let { params } : { params : { id: string } } = $props();
  let manga = $state<Manga | undefined>()
  let addToCartValue = $state<number>(0)

  const updateCartContent = () => {
    if (!manga) return;
    addToCart({ manga_id: manga.manga_id, quantity: addToCartValue });
  };

  const fetchContent = async () => {
    await fetchMangas()
    await fetchMangaDetails(parseInt(params.id));
  }

  $effect(() => {
    manga = $mangaStore.find(item => item.manga_id === parseInt(params.id));
  })

  onDestroy(() => serverError.set({ isError: false, message: "" }));
</script>

{#if $serverError.isError}
  <Alert.Root class="w-3/5 text-center m-auto mt-5" variant="destructive">
    <Alert.Title>{$serverError.message}</Alert.Title>
  </Alert.Root>
{:else}
  {#await fetchContent()}
    <Skeleton class="h-[95vh] m-3 border border-card-foreground"/>
  {:then _}
    {#if !manga}
      <Alert.Root class="w-3/5 text-center m-auto mt-5" variant="destructive">
        <Alert.Title>Manga not found</Alert.Title>
      </Alert.Root>
      {:else}
      <Header />
      <main class="px-3 min-[500px]:px-20 min-[700px]:py-6">
        <div class="main border border-card-foreground rounded-3xl p-6">
          <div class="row-span-full manga-img">
            <img src={manga.img_url} alt={manga.title} class="w-full h-full object-cover"/>
          </div>

          <div class="ml-4 manga-bio">
            <h1 class="text-[2.5rem]">{manga.title}</h1>
            <p class="text-lg hidden min-[1200px]:block">{manga.description}</p>
            <Dialog.Root>
              <Dialog.Trigger class={`${buttonVariants({variant: "default"})} min-[1200px]:hidden`}>Show description</Dialog.Trigger>
              <Dialog.Content class="p-8">
               <p class="text-lg">{manga.description}</p>
              </Dialog.Content>
            </Dialog.Root>
          </div>

          <div class="col-start-2 col-end-3 ml-4 mt-2 flex flex-col gap-2 manga-tags">
            <p>
              <span class="text-primary">Genres:</span>
              <span>
                {#each manga.genres as genre (genre.genre_id)}
                  {genre.name}{" "}
                {/each}
              </span>
            </p>
            <p><span class="text-primary">Author:</span> {manga.author}</p>
            <p><span class="text-primary">In the stock:</span> {manga.stock_quantity}</p>
          </div>

          <div class="max-w-fit row-start-1 -col-start-1 manga-price ml-4 flex flex-col gap-y-2">
            <h2 class="font-bold text-4xl text-primary">{manga.price} PLN</h2>
            <div>
              <div class="flex items-center space-x-2">
                <Button class="w-[40px] text-2xl" onclick={() => addToCartValue - 1 < 0 ? (addToCartValue = 0) : (addToCartValue -= 1)}
                >-</Button>
                <Input bind:value={addToCartValue} class="text-center flex-grow max-w-[80px] text-lg"/>
                <Button class="w-[40px] text-2xl" onclick={() => manga?.stock_quantity && addToCartValue + 1 > manga.stock_quantity
                ? (addToCartValue = manga.stock_quantity) : addToCartValue += 1}>+</Button>
              </div>
            </div>
            <Button onclick={updateCartContent} class="w-full">Add to cart</Button>
          </div>
        </div>
        <Reviews manga_id={manga.manga_id} />
        <Toaster theme="dark" toastOptions={{
          classes: {
            toast: "border-2 text-lg",
          }
        }}/>
      </main>
    {/if}
  {/await}
{/if}

<style>
  .main {
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    grid-template-rows: min-content min-content min-content;

  }

  @media(max-width: 900px) {
    .main {
      grid-template-columns: max-content 1fr;
    }

    .manga-img {
      grid-column: 1 / 2;
    }

    .manga-price {
      grid-column: 2 / -1;
      grid-row: 3 / -1;
    }
  }

  @media(max-width: 700px) {
    .main {
      grid-template-columns: 1fr;
      row-gap: 1rem;
    }

    .manga-img {
      grid-row: 1 / 2;
      justify-self: center;

    }

    .manga-tags {
      grid-column: 1 / -1;
    }

    .manga-price {
      grid-column: 1 / -1;
      grid-row: 4 / 5;
    }
  }
</style>
