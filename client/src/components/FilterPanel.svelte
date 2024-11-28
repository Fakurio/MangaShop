<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Label } from "$lib/components/ui/label/index.js";
  import {
    fetchMangaDetails,
    mangaStore,
    filteredGenres,
    filteredPriceRange,
    fetchGenres
  } from "../stores/manga.store";
  import { get } from "svelte/store";
  import type { PriceRange } from "../types/price-range";

  let selectedGenres: string[] = [];
  let selectedPriceRange: PriceRange = { from: 0, to: 200 };


  const applyFilters = async () => {
    for (let manga of get(mangaStore)) {
      await fetchMangaDetails(manga.manga_id);
    }
    filteredGenres.set(selectedGenres);
    if (!selectedPriceRange.from) {
      selectedPriceRange.from = 0;
    }
    if (!selectedPriceRange.to) {
      selectedPriceRange.to = 200;
    }
    filteredPriceRange.set(selectedPriceRange);
  };

  const addGenre = (genre: string) => {
    selectedGenres.push(genre);
    console.log(selectedGenres);
  }

  const removeGenre = (genre: string) => {
    selectedGenres = selectedGenres.filter(item => item !== genre);
    console.log(selectedGenres);
  }
</script>

<aside class="filter-panel bg-secondary-foreground border">
  <section>
    {#await fetchGenres()}
      Loading...
    {:then genres}
      <h2 class="text-xl text-white">Genre</h2>
      <div class="mt-4 flex flex-col gap-4">
        {#each genres as genre (genre.genre_id)}
          <div class="flex items-center gap-2">
            <Checkbox onCheckedChange={(v) => {
                if (v) {
                  addGenre(genre.name);
                } else {
                  removeGenre(genre.name);
                }
              }} id={genre.name} value={genre.name} class="border-amber-600"></Checkbox>
            <Label class="text-white" for={genre.name}>{genre.name}</Label>
          </div>
        {/each}
      </div>
    {:catch error}
      <p class="error error--server">{error}</p>
    {/await}
  </section>
  <section class="mt-4">
    <h2 class="text-white text-xl">Price</h2>
    <div class="flex gap-4 mt-2 relative">
      <Input placeholder="Min" type="number" bind:value={selectedPriceRange.from}></Input>
      <Input placeholder="Max" type="number" bind:value={selectedPriceRange.to}></Input>
    </div>
  </section>
  <Button on:click={applyFilters} class="mt-4">Apply Filters</Button>
</aside>

<style>
  .filter-panel {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    border-radius: 1.5rem;
    height: min-content;
    width: 300px;
  }

  @media (max-width: 920px) {
    .filter-panel {
      grid-column: 1 / 1;
      grid-row: 2 / 3;
      width: 100%;
      justify-self: center;
    }
  }
</style>
