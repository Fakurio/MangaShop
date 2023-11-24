<script lang="ts">
  import { fetchMangaDetails } from "../stores/manga.store";
  import { mangaStore } from "../stores/manga.store";
  import { onMount } from "svelte";
  import type { Manga } from "../types/manga";

  export let params: { id: string } = {} as any;
  let manga: Manga | undefined;

  onMount(() => {
    async function getMangaDetails() {
      await fetchMangaDetails(parseInt(params.id));
    }

    getMangaDetails();
  });

  $: manga = $mangaStore.find((item) => item.manga_id === parseInt(params.id));
</script>

<p>Details of manga {params.id}</p>
{#if manga}
  <p>{manga.description}</p>
  <p>{manga.author}</p>
  {#if manga.genres}
    {#each manga.genres as genre}
      <p>{genre.name}</p>
    {/each}
  {/if}
  <p>{manga.stock_quantity}</p>
{/if}
