<script lang="ts">
  import {Button} from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Skeleton } from "$lib/components/ui/skeleton/index.js";
  import {fetchGenres} from "../stores/manga.store";
  import type { PriceRange } from "../types/price-range";

  interface FilterPanelProps {
    selectedPriceRange: PriceRange;
    selectedGenres: string[];
    addGenre: (genre: string) => void;
    removeGenre: (genre: string) => void;
    applyFilters: () => void;
    toggleDialog?: () => void;
  }

  let {
    addGenre,
    removeGenre,
    applyFilters,
    selectedGenres,
    selectedPriceRange = $bindable(),
    toggleDialog,
  }: FilterPanelProps = $props();


</script>

<aside class="filter-panel bg-card border-2 border-border">
  <section>
    {#await fetchGenres()}
      <Skeleton class="h-64 w-[250px]" />
    {:then genres}
      <h2 class="text-xl text-card-foreground">Genre</h2>
      <div class="mt-4 flex flex-col gap-4">
        {#each genres as genre (genre.genre_id)}
          <div class="flex items-center gap-2">
            <Checkbox onCheckedChange={(v) => {
                if (v) {
                  addGenre(genre.name);
                } else {
                  removeGenre(genre.name);
                }
              }} checked={selectedGenres.includes(genre.name)} id={genre.name} value={genre.name}></Checkbox>
            <Label class="text-card-foreground" for={genre.name}>{genre.name}</Label>
          </div>
        {/each}
      </div>
    {:catch error}
      <p class="error error--server">{error}</p>
    {/await}
  </section>
  <section class="mt-6">
    <h2 class="text-card-foreground text-xl">Price</h2>
    <div class="flex gap-4 mt-2">
      <Input placeholder="Min" type="number" bind:value={selectedPriceRange.from}></Input>
      <Input placeholder="Max" type="number" bind:value={selectedPriceRange.to}></Input>
    </div>
  </section>
  <Button on:click={() => {
    applyFilters()
    if(toggleDialog) {
      toggleDialog();
    }
  }} class="mt-4">Apply Filters</Button>
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
