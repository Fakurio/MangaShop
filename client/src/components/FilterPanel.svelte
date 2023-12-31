<script lang="ts">
  import Button from "./Button.svelte";
  import {
    fetchMangaDetails,
    mangaStore,
    filteredGenres,
    filteredPriceRange,
  } from "../stores/manga.store";
  import { get } from "svelte/store";
  import type { PriceRange } from "../types/price-range";

  let selectedGenres: string[] = [];
  let selectedPriceRange: PriceRange = { from: 0, to: 200 };

  const fetchGenres = async () => {
    let response = await fetch("http://localhost:3000/genres");
    if (response.ok) {
      let genres = await response.json();
      return genres;
    } else {
      let error = await response.json();
      throw new Error(error.message);
    }
  };

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
</script>

<aside class="filter-panel">
  <section>
    {#await fetchGenres()}
      Loading...
    {:then genres}
      <h2 class="section-title">Genres</h2>
      <div class="filter-panel__genres">
        {#each genres as genre (genre.genre_id)}
          <div class="filter-panel__genre">
            <input
              id={genre.genre_id}
              value={genre.name}
              bind:group={selectedGenres}
              type="checkbox"
            />
            <label for={genre.genre_id}>{genre.name}</label>
          </div>
        {/each}
      </div>
    {:catch error}
      <p class="error error--server">{error}</p>
    {/await}
  </section>
  <section class="price-section">
    <h2 class="section-title">Price</h2>
    <div class="price-section__price-range-wrapper">
      <input type="number" bind:value={selectedPriceRange.from} />
      <input type="number" bind:value={selectedPriceRange.to} />
    </div>
  </section>
  <Button text="Apply Filters" onClick={applyFilters} />
</aside>

<style>
  .filter-panel {
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    background: #282628;
    border-radius: 1.5rem;
    height: min-content;
    width: 300px;
  }

  .section-title {
    color: white;
    font-size: 1.4rem;
  }

  .filter-panel__genres {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .filter-panel__genre {
    display: flex;
    align-items: center;
  }

  label {
    color: #777676;
    margin-left: 0.5rem;
    font-weight: 400;
    cursor: pointer;
  }

  input[type="checkbox"] {
    appearance: none;
    background-color: #323133;
    margin: 0;
    width: 1.3em;
    height: 1.3em;
    border-radius: 0.3rem;
    border: 0.01rem solid #777676;
  }

  input[type="checkbox"]:checked {
    background-color: #e58e27;
    background-image: url("./check.svg");
  }

  .price-section {
    margin-top: 3rem;
  }

  .price-section__price-range-wrapper {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    position: relative;
  }

  input[type="number"] {
    width: 100px;
    padding: 0.5rem 0.1rem;
    font-size: 1rem;
    padding-left: 1rem;
    background-color: #323133;
    border: none;
    border-radius: 0.5rem;
    color: white;
  }

  .price-section__price-range-wrapper::before {
    content: "";
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #777676;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  @media (max-width: 920px) {
    .filter-panel {
      grid-column: 1 / 1;
      grid-row: 2 / 3;
      width: 100%;
      justify-self: center;
    }

    .filter-panel__genres {
      flex-direction: row;
      flex-wrap: wrap;
    }

    input[type="number"] {
      width: auto;
    }
  }

  @media (max-width: 640px) {
    .price-section__price-range-wrapper {
      flex-wrap: wrap;
    }

    input[type="number"] {
      width: 100%;
    }

    input[type="number"] + input[type="number"] {
      margin-top: 2rem;
    }
  }
</style>
