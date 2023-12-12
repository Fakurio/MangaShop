<script lang="ts">
  import { fetchMangaDetails, serverError } from "../stores/manga.store";
  import { mangaStore } from "../stores/manga.store";
  import { onDestroy, onMount } from "svelte";
  import type { Manga } from "../types/manga";
  import Header from "../components/Header.svelte";
  import Button from "../components/Button.svelte";
  import Reviews from "../components/Reviews.svelte";

  export let params: { id: string } = {} as any;
  let manga: Manga | undefined;
  let isLoading = true;
  let addToCartValue: number = 0;

  onMount(async () => {
    try {
      await fetchMangaDetails(parseInt(params.id));
    } finally {
      isLoading = false;
    }
  });

  onDestroy(() => serverError.set({ isError: false, message: "" }));

  $: manga = $mangaStore.find((item) => item.manga_id === parseInt(params.id));
</script>

{#if $serverError.isError}
  <p class="error error--server">{$serverError.message}</p>
{:else if !isLoading && manga}
  <Header />
  <main>
    <div class="manga-logo">
      <img src={manga.img_url} alt={manga.title} />
    </div>

    <div class="manga-header">
      <h1 class="manga-header__title">{manga.title}</h1>
      <p class="manga-header__description">{manga.description}</p>
    </div>

    <div class="manga-footer">
      <p>
        <span class="accent">Genres:</span>
        <span>
          {#each manga.genres as genre (genre.genre_id)}
            {genre.name}{" "}
          {/each}
        </span>
      </p>
      <p><span class="accent">Author:</span> {manga.author}</p>
      <p><span class="accent">In the stock:</span> {manga.stock_quantity}</p>
    </div>

    <div class="cart-adder">
      <h2 class="cart-adder__price">{manga.price} PLN</h2>
      <div>
        <div class="cart-adder__adder">
          <button
            on:click={() =>
              addToCartValue - 1 < 0
                ? (addToCartValue = 0)
                : (addToCartValue -= 1)}>-</button
          >
          <input type="text" bind:value={addToCartValue} />
          <button
            on:click={() =>
              manga?.stock_quantity && addToCartValue + 1 > manga.stock_quantity
                ? (addToCartValue = manga.stock_quantity)
                : (addToCartValue += 1)}>+</button
          >
        </div>
        <Button text="Add to cart" className="cart-adder__btn" />
      </div>
    </div>

    <Reviews />
  </main>
{/if}

<style>
  main {
    display: grid;
    grid-template-columns: 400px 1fr min-content;
    grid-template-rows: min-content min-content min-content;
    padding: 1.5rem 5rem;
  }

  .manga-logo {
    max-width: 400px;
    width: 100%;
    grid-column: 1 / 2;
    grid-row: 1 / 3;
  }

  .manga-logo img {
    object-fit: cover;
    width: 100%;
  }

  .manga-header {
    grid-column: 2 / 3;
    color: white;
    margin-left: 1rem;
  }

  .manga-header__title {
    font-size: 2.5rem;
  }

  .manga-header__description {
    font-size: 1.1rem;
    line-height: 1.5;
    margin-top: 1rem;
  }

  .manga-footer {
    grid-column: 2 / 3;
    color: white;
    margin-left: 1rem;
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .manga-footer .accent {
    color: #e58e27;
  }

  .cart-adder {
    grid-column: 3 / -1;
    grid-row: 1 / 2;
    color: white;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 2rem;
    min-width: 300px;
  }

  .cart-adder__price {
    color: #e58e27;
    font-weight: 700;
    font-size: 2.5rem;
  }

  .cart-adder__adder button {
    color: white;
    padding: 0.5em;
    font-size: 2rem;
    background-color: #383638;
    border-radius: 0.5rem;
    width: 50px;
    margin-top: 1rem;
  }

  .cart-adder__adder input {
    background-color: #383638;
    border: none;
    border-radius: 0.5rem;
    padding: 1rem;
    font-size: 2rem;
    width: 100px;
    margin-inline: 1rem;
    color: white;
    text-align: center;
  }

  .cart-adder :global(.cart-adder__btn) {
    width: 100%;
  }

  @media (max-width: 1200px) {
    main {
      grid-template-columns: 400px 1fr;
      grid-template-rows: 1fr min-content;
    }

    .manga-logo {
      grid-row: 1 / 2;
      max-width: 400px;
    }
    .manga-header {
      grid-row: 2 / 3;
      grid-column: 1 / -1;
    }

    .manga-footer {
      grid-row: 3 / 4;
      grid-column: 1 / -1;
    }

    .cart-adder {
      grid-row: 1 / 2;
      grid-column: 2 / -1;
    }
  }

  @media (max-width: 850px) {
    main {
      grid-template-columns: 1fr;
    }

    .manga-logo {
      max-width: 300px;
    }

    .manga-logo,
    .manga-header,
    .manga-footer,
    .cart-adder {
      grid-column: 1 / -1;
    }

    .manga-header {
      margin-top: 2rem;
    }

    .cart-adder {
      grid-row: 4 / 5;
      margin-top: 3rem;
    }
  }

  @media (max-width: 500px) {
    main {
      padding-inline: 0.5rem;
    }

    .manga-logo {
      margin: 0 auto;
    }
  }
</style>
