<script lang="ts">
  import Icon from "./Icon.svelte";
  import { filteredText } from "../stores/manga.store";
  import { onMount } from "svelte";

  let query: string;
  let input: HTMLInputElement;

  const filterMangasByTitle = () => {
    filteredText.set(query);
  };

  const handleEnterKey = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      filterMangasByTitle();
    }
  };

  onMount(() => {
    input.addEventListener("keydown", (e) => handleEnterKey(e));

    return () => input.removeEventListener("keydown", handleEnterKey);
  });
</script>

<div class="search-bar">
  <input type="text" bind:value={query} bind:this={input} />
  <Icon type="search" onClick={filterMangasByTitle} />
</div>

<style>
  .search-bar {
    background-color: #383638;
    grid-column: 2 / -1;
    grid-row: 1 / 2;
    border-radius: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 50%;
    justify-self: center;
    padding: 1.5rem 2rem;
    height: 50%;
    align-self: self-start;
  }

  .search-bar input {
    background-color: transparent;
    border: none;
    width: 90%;
    color: white;
    font-size: 1.2rem;
  }

  @media (max-width: 920px) {
    .search-bar {
      grid-column: 1 / 1;
      grid-row: 1 / 2;
      width: 100%;
    }
  }
</style>
