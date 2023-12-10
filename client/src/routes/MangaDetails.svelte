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
  <p>{$serverError.message}</p>
{:else if !isLoading && manga}
  <Header />
  <main>
    <div class="manga-details">
      <div class="manga-logo">
        <img src={manga.img_url} alt={manga.title} />
      </div>

      <div class="manga-info">
        <h1 class="manga-info__title">{manga.title}</h1>
        <p class="manga-info__description">{manga.description}</p>
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
    </div>

    <div class="cart-adder">
      <h2 class="cart-adder__price">{manga.price} PLN</h2>
      <div>
        <div class="cart-adder__adder">
          <button>-</button>
          <input type="text" />
          <button>+</button>
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
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    padding: 1.5rem 5rem;
  }

  .manga-details {
    display: flex;
  }

  .manga-logo {
    min-width: 400px;
  }

  .manga-logo img {
    object-fit: cover;
    width: 100%;
  }

  .manga-info {
    color: white;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 0 1rem;
  }

  .manga-info__title {
    font-size: 2.5rem;
  }

  .manga-info__description {
    font-size: 1.1rem;
    line-height: 1.3;
  }

  .manga-info .accent {
    color: #e58e27;
  }

  .cart-adder {
    color: white;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 2rem;
  }

  .cart-adder__price {
    color: #e58e27;
    font-weight: 700;
    font-size: 2.5rem;
  }

  .cart-adder__adder {
    margin-top: 3rem;
  }

  .cart-adder__adder button {
    color: white;
    padding: 0.5em;
    font-size: 2rem;
    background-color: #383638;
    border-radius: 0.5rem;
    width: 50px;
  }

  .cart-adder__adder input {
    background-color: #383638;
    border: none;
    border-radius: 0.5rem;
    padding: 1rem;
    font-size: 2rem;
    width: 100px;
    margin-inline: 1rem;
  }

  .cart-adder :global(.cart-adder__btn) {
    width: 100%;
  }
</style>
