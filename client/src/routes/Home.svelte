<script lang="ts">
  import { mangaStore, serverError } from "../stores/manga.store";
  import MangaCard from "../components/MangaCard.svelte";
  import Header from "../components/Header.svelte";
  import FilterPanel from "../components/FilterPanel.svelte";
  import { onDestroy } from "svelte";

  onDestroy(() => serverError.set({ isError: false, message: "" }));
</script>

{#if $serverError.isError}
  <p>{$serverError.message}</p>
{:else if $mangaStore.length === 0}
  <p>Try reloading the page</p>
{:else}
  <Header />
  <main>
    <FilterPanel />
    <section class="mangas">
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
    </section>
  </main>
{/if}

<style>
  main {
    display: grid;
    grid-template-columns: 1fr 2fr;
    padding: 1.5rem;
  }

  .mangas {
    display: flex;
    align-items: center;
  }
</style>
