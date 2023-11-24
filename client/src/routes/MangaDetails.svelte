<script lang="ts">
  import { fetchMangaDetails, serverError } from "../stores/manga.store";
  import { mangaStore } from "../stores/manga.store";
  import { onDestroy, onMount } from "svelte";
  import type { Manga } from "../types/manga";

  export let params: { id: string } = {} as any;
  let manga: Manga | undefined;
  let isLoading = true;

  onMount(async () => {
    try {
      await fetchMangaDetails(parseInt(params.id));
    } finally {
      isLoading = false;
    }
  });

  onDestroy(() => serverError.set({ isError: false, message: "" }));

  $: manga = $mangaStore.find((item) => item.manga_id === parseInt(params.id));
</script>

{#if $serverError.isError}
  <p>{$serverError.message}</p>
{:else if !isLoading && manga}
  <p>Details of manga {params.id}</p>
  <p>{manga.title}</p>
  <p>{manga.description}</p>
  <p>{manga.author}</p>
  {#each manga.genres as genre}
    <p>{genre.name}</p>
  {/each}
  <p>{manga.stock_quantity}</p>
{/if}
