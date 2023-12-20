<script lang="ts">
  import { link } from "svelte-spa-router";
  import Button from "./Button.svelte";
  import { addToCart } from "../stores/cart.store";

  export let title: string;
  export let img_url: string;
  export let price: number;
  export let manga_id: number;
</script>

<div class="manga-card">
  <img src={img_url} alt={title} class="manga-card__img" />
  <h2 class="manga-card__title">
    <a href="/manga/{manga_id}" use:link>{title}</a>
  </h2>
  <div class="manga-card__footer">
    <span class="manga-card__price">{price} PLN</span>
    <Button
      onClick={() => addToCart({ manga_id, quantity: 1 })}
      text="Buy"
      className="manga-card__btn"
    />
  </div>
</div>

<style>
  .manga-card {
    background-color: #282628;
    padding: 1.5rem;
    border-radius: 1.5rem;
    width: 300px;
    display: grid;
    grid-template-rows: 340px 1fr min-content;
  }

  .manga-card__img {
    border-radius: 1.5rem;
    height: 340px;
    width: 250px;
  }

  .manga-card__title {
    color: white;
    margin-top: 0.8rem;
  }

  .manga-card__title:hover {
    color: #e58e27;
  }

  .manga-card__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
  }

  .manga-card__price {
    color: #e58e27;
    font-weight: 700;
    font-size: 1.3rem;
  }

  .manga-card :global(.manga-card__btn) {
    padding-inline: 3rem;
    margin-top: 0;
  }

  @media (max-width: 400px) {
    .manga-card__footer {
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>
