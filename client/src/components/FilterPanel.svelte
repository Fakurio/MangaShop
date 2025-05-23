<script lang="ts">
  import {Button} from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import {fetchGenres} from "../stores/manga.store";
  import type { PriceRange } from "../types/price-range";
  import { Label } from "$lib/components/ui/label/index.js";

  interface FilterPanelProps {
    selectedPriceRange: PriceRange;
    selectedGenres: string[];
    addGenre: (genre: string) => void;
    removeGenre: (genre: string) => void;
    applyFilters: () => void;
    toggleDialog?: () => void;
    resetFilters: () => void;
  }

  let {
    addGenre,
    removeGenre,
    applyFilters,
    selectedGenres,
    selectedPriceRange = $bindable(),
    toggleDialog,
    resetFilters,
  }: FilterPanelProps = $props();

</script>

<aside class="bg-card border-2 border-border flex flex-col p-6 rounded-3xl h-min w-[300px] filter-panel">
  <section>
    {#await fetchGenres()}
      <Skeleton class="h-64 w-full" />
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
            <Label class="text-primary-foreground" for={genre.name}>{genre.name}</Label>
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
  <Button onclick={() => {
    applyFilters()
    if(toggleDialog) {
      toggleDialog();
    }
  }} class="mt-4">Apply Filters</Button>
  <Button onclick={resetFilters} variant="secondary" class="mt-4">Reset</Button>
</aside>

<style>
  @media (max-width: 920px) {
    .filter-panel {
      grid-column: 1 / 1;
      grid-row: 2 / 3;
      width: 100%;
      justify-self: center;
    }
  }
</style>
