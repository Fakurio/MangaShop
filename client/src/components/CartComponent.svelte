<script lang="ts">
  import { get } from "svelte/store";
  import cartStore from "../stores/cart.store";
  import { addToCart, deleteFromCart } from "../stores/cart.store";
  import { mangaStore } from "../stores/manga.store";
  import type { CartItem, CartItemDisplay } from "../types/cart-item";

  let cartContent: CartItemDisplay[];

  const getMangaInfoFromStore = () => {
    cartContent = $cartStore.map((cartItem: CartItem) => {
      let manga = $mangaStore.find(
        (item) => item.manga_id === cartItem.manga_id
      );
      return {
        manga_id: manga?.manga_id,
        logo: manga?.img_url,
        title: manga?.title,
        price: manga?.price,
        quantity: cartItem.quantity,
      };
    });
  };

  const increaseQuantity = (manga_id: number, quantity: number) => {
    let manga = get(mangaStore).find((manga) => manga.manga_id === manga_id);
    if (manga && quantity + 1 > manga.stock_quantity) {
      return;
    }
    addToCart({ manga_id, quantity: 1 });
  };

  const decreaseQuantity = (manga_id: number, quantity: number) => {
    if (quantity - 1 <= 0) {
      deleteFromCart(manga_id);
      return;
    }
    addToCart({ manga_id, quantity: -1 });
  };

  $: $cartStore, getMangaInfoFromStore();
</script>

<div class="cart">
  <header class="cart__header">
    <h1>Shopping Cart</h1>
    <p>Unique items: {$cartStore.length}</p>
  </header>
  {#each cartContent as manga (manga.manga_id)}
    <div class="cart__item">
      <div class="item__left">
        <img src={manga.logo} alt={manga.title} />
        <h2>{manga.title}</h2>
      </div>

      <div class="item__middle">
        <button
          on:click={() => decreaseQuantity(manga.manga_id || 0, manga.quantity)}
          >-</button
        >
        <input type="text" bind:value={manga.quantity} readonly />
        <button
          on:click={() => increaseQuantity(manga.manga_id || 0, manga.quantity)}
          >+</button
        >
      </div>

      <div class="item__right">
        <div class="item__right__price">
          <h2>Total: {(manga.quantity * (manga.price || 0)).toFixed(2)} PLN</h2>
          <p class="price__value">{manga.price} PLN per item</p>
        </div>
      </div>

      <button
        on:click={() => deleteFromCart(manga.manga_id || 0)}
        class="item__delete"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="item__delete__icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  {/each}
</div>

<style>
  .cart {
    background-color: #282628;
    border-radius: 0.5rem;
    max-width: 1000px;
    margin: 0 auto;
    color: white;
    padding: 2rem;
  }

  .cart__header {
    display: flex;
    justify-content: space-between;
  }

  .cart__item {
    background-color: #383638;
    border-radius: 0.5rem;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr min-content;
    padding: 1rem;
    margin-top: 1.5rem;
  }

  .item__left {
    display: flex;
  }

  .item__left img {
    width: 100px;
  }

  .item__left h2 {
    margin-left: 1rem;
  }

  .item__middle {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .item__middle input {
    background-color: #282628;
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem;
    width: 100px;
    font-size: 1rem;
    margin-inline: 1rem;
    color: white;
    text-align: center;
  }

  .item__middle button {
    background-color: #282628;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
  }

  .item__right {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }

  .item__right__price {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }

  .price__value {
    font-weight: 300;
    font-size: 0.9rem;
  }

  .item__delete__icon {
    width: 30px;
    height: 30px;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    .cart__item {
      grid-template-columns: 1fr 1fr min-content;
      grid-template-rows: 1fr 1fr;
    }

    .item__left {
      grid-row: 1 / -1;
    }

    .item__middle {
      grid-row: 2 / -1;
    }

    .item__right {
      grid-row: 1 / 2;
    }

    .item__delete {
      grid-row: 1 / -1;
    }

    .item__middle input,
    .item__middle button {
      width: 50px;
    }

    .item__right__price {
      text-align: center;
    }
  }

  @media (max-width: 600px) {
    .cart__item {
      grid-template-rows: 1fr min-content min-content;
      grid-template-columns: 1fr min-content;
    }

    .item__left {
      grid-row: 1 / 2;
    }

    .item__middle {
      grid-row: 3 / -1;
      margin-top: 1.5rem;
    }

    .item__right {
      grid-row: 2 / 3;
      margin-top: 1.5rem;
    }
  }
</style>
