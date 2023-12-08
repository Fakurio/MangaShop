<script lang="ts">
  import { mangaStore, serverError } from "../stores/manga.store";
  import MangaCard from "../components/MangaCard.svelte";
  import Header from "../components/Header.svelte";
  import SearchBar from "../components/SearchBar.svelte";
  import FilterPanel from "../components/FilterPanel.svelte";
  import { onDestroy } from "svelte";

  onDestroy(() => serverError.set({ isError: false, message: "" }));
</script>

{#if $serverError.isError}
  <p>{$serverError.message}</p>
{:else}
  <Header />
  <main>
    <FilterPanel />
    <SearchBar />
    <section class="mangas">
      {#each $mangaStore as manga (manga.manga_id)}
        <MangaCard
          manga_id={manga.manga_id}
          title={manga.title}
          img_url={manga.img_url}
          price={manga.price}
        />
      {/each}
    </section>
  </main>
{/if}

<style>
  main {
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: 100px 1fr 1fr;
    padding: 1.5rem 5rem;
  }

  .mangas {
    display: flex;
    justify-content: space-evenly;
    gap: 2rem;
    flex-wrap: wrap;
    grid-column: 2 / -1;
    grid-row: 2 / -1;
  }

  @media (max-width: 920px) {
    main {
      grid-template-columns: 1fr;
      grid-template-rows: 100px min-content 1fr;
    }

    .mangas {
      grid-row: 3 / -1;
      grid-column: 1 / 1;
      margin-top: 3rem;
    }
  }

  @media (max-width: 640px) {
    main {
      padding-inline: 2rem;
    }

    @media (max-width: 380px) {
      main {
        padding-inline: 0.5rem;
      }
    }
  }
</style>
