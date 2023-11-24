<script lang="ts">
  import { mangaStore, serverError } from "../stores/manga.store";
  import MangaCard from "../components/MangaCard.svelte";
  import { onDestroy } from "svelte";

  onDestroy(() => serverError.set({ isError: false, message: "" }));
</script>

{#if $serverError.isError}
  <p>{$serverError.message}</p>
{:else if $mangaStore.length === 0}
  <p>Try reloading the page</p>
{:else}
  <h1>Mangas</h1>
  <ul>
    {#each $mangaStore as manga (manga.manga_id)}
      <li>
        <MangaCard
          manga_id={manga.manga_id}
          title={manga.title}
          img_url={manga.img_url}
          price={manga.price}
        />
      </li>
    {/each}
  </ul>
{/if}
