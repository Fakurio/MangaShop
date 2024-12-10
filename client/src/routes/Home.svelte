<script lang="ts">
  import {fetchMangas, filteredMangaStore, mangaStore, serverError} from "../stores/manga.store";
  import MangaCard from "../components/MangaCard.svelte";
  import Header from "../components/Header.svelte";
  import SearchBar from "../components/SearchBar.svelte";
  import {onDestroy} from "svelte";
  import FilterPanelMQ from "../components/FilterPanelMQ.svelte";
  import * as Alert from "$lib/components/ui/alert";
  import {Skeleton} from "$lib/components/ui/skeleton";
  import {Toaster} from "$lib/components/ui/sonner";
  let scrollPos = $state<number>(0)
  let loadedCards = $state<{title: string, loaded: boolean}[]>([])


  const scrollHandler = () => {
    scrollPos = window.scrollY;
  }

  const handleCardLoad = (title: string) => {
    loadedCards = loadedCards.map(item => {
      return item.title === title ? {...item, loaded: true} : item;
    })
    const areAllLoaded = loadedCards.every(item => item.loaded)
    if(areAllLoaded) {
      scrollTo(0, Number(localStorage.getItem("scrollPos")!))
    }
  }

  window.addEventListener("scroll", scrollHandler);
  window.addEventListener("beforeunload", () => localStorage.removeItem("scrollPos"));

  $effect(() => {
    loadedCards = $filteredMangaStore.map(manga => {
      return {title: manga.title, loaded: false}
    })
  })

  onDestroy(() => {
    localStorage.setItem("scrollPos", scrollPos.toString())
    serverError.set({ isError: false, message: "" })
    window.removeEventListener("scroll", scrollHandler);
  });
</script>

{#if $serverError.isError}
  <Alert.Root class="w-3/5 text-center m-auto mt-5" variant="destructive">
    <Alert.Title>{$serverError.message}</Alert.Title>
  </Alert.Root>
{:else}
  <Header />
  <main>
    {#if $mangaStore.length > 0}
      <FilterPanelMQ/>
      <SearchBar />
    {/if}
    <section class="mangas">
      {#await fetchMangas()}
        <Skeleton class="h-64 w-full m-auto"/>
      {:then _}
      {#if $filteredMangaStore.length === 0}
          <Alert.Root class="w-3/5 text-center">
              <Alert.Title>No manga meets criteria</Alert.Title>
          </Alert.Root>
      {:else}
      {#each $filteredMangaStore as manga (manga.manga_id)}
        <MangaCard
          manga_id={manga.manga_id}
          title={manga.title}
          img_url={manga.img_url}
          price={manga.price}
          {handleCardLoad}
        />
      {/each}
      {/if}
      {/await}
    </section>
  </main>
  <Toaster theme="dark" toastOptions={{
    classes: {
      toast: "border-2 text-lg",
    }}}
  />
{/if}

<style>
  main {
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: 100px 1fr 1fr;
    padding: 1.5rem 5rem;
    column-gap: 2rem;
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
      grid-template-rows: min-content min-content 1fr;
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
  }

  @media (max-width: 380px) {
    main {
      padding-inline: 1rem;
    }
  }
</style>
