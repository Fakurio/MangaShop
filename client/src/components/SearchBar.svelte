<script lang="ts">
  import { filteredText } from "../stores/manga.store";
  import {Input} from "$lib/components/ui/input";
  import {Search} from "lucide-svelte";
  import {onDestroy, onMount} from "svelte";

  let query = $state<string>("");

  const filterMangasByTitle = () => {
    filteredText.set(query);
  };

  const handleEnterKey = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      filterMangasByTitle();
    }
  };

  onMount(() => {
    const lcQuery = localStorage.getItem("searchQuery");
    if(lcQuery) {
      query = JSON.parse(lcQuery);
    }
  })

  onDestroy(() => {
    localStorage.setItem("searchQuery", JSON.stringify(query));
  })
</script>

<div class="relative flex justify-center w-3/5 justify-self-center search-bar">
  <Search class="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
  <Input
          type="search"
          placeholder="Search..."
          class="border-2 pl-8"
          bind:value={query}
          on:keydown={handleEnterKey}
  />
</div>

<style>
  @media (max-width: 920px) {
    .search-bar {
      grid-column: 1 / 1;
      grid-row: 1 / 2;
      width: 100%;
    }
  }
</style>
