<script lang="ts">
  import { get } from "svelte/store";
  import cartStore from "../stores/cart.store";
  import { addToCart, deleteFromCart } from "../stores/cart.store";
  import { mangaStore } from "../stores/manga.store";
  import type { CartItem, CartItemDisplay } from "../types/cart-item";
  import {Button} from "$lib/components/ui/button";
  import {X} from "lucide-svelte"

  let cartContent = $derived.by<CartItemDisplay[]>(() => {
    return $cartStore.map((cartItem: CartItem) => {
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
    }) ;
  })

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
</script>

<div class="border-2 border-border p-6 rounded-3xl w-full">
  <header class="flex justify-between items-end flex-wrap gap-7">
    <h1 class="font-bold text-xl">Shopping Cart</h1>
    <p class="font-bold">Unique items: {$cartStore.length}</p>
  </header>
  {#each cartContent as manga (manga.manga_id)}
    <div class="cart-item grid grid-cols-[300px_min-content_1fr_min-content] p-4 mt-6 rounded-md border-border border-2">
      <div class="item-left flex">
        <img src={manga.logo} alt={manga.title} class="w-[100px]"/>
        <h2 class="ml-4 text-lg">{manga.title}</h2>
      </div>

      <div class="item-middle flex justify-evenly items-center gap-4">
        <Button class="text-2xl w-[40px]"  onclick={() => decreaseQuantity(manga.manga_id || 0, manga.quantity)}>-</Button>
        <span class="w-[30px] text-center">{manga.quantity}</span>
        <Button class="text-2xl w-[40px]" onclick={() => increaseQuantity(manga.manga_id || 0, manga.quantity)}>+</Button>
      </div>

        <div class="item-right flex flex-col gap-2 items-center self-center">
          <h2 class="font-bold">Total: {(manga.quantity * (manga.price || 0)).toFixed(2)} PLN</h2>
          <p class="font-light text-sm">{manga.price} PLN per item</p>
        </div>

      <div class="item-delete flex justify-end items-center">
        <Button onclick={() => deleteFromCart(manga.manga_id || 0)} variant="destructive">
          <X/>
        </Button>
      </div>
    </div>
  {/each}
</div>

<style>
  @media (max-width: 800px) {
    .cart-item {
      grid-template-columns: 300px min-content 1fr;
      grid-template-rows: 1fr 1fr;
    }

    .item-left {
      grid-row: 1 / -1;
    }

    .item-middle {
      grid-row: 2 / -1;
    }

    .item-right {
      grid-row: 1 / 2;
    }

    .item-delete {
      grid-row: 1 / -1;
    }
  }

  @media (max-width: 640px) {
    .cart-item {
      grid-template-rows: 1fr min-content min-content;
      grid-template-columns: 1fr min-content;
    }

    .item-left {
      grid-row: 1 / 2;
    }

    .item-middle {
      grid-row: 3 / -1;
      margin-top: 1.5rem;
      justify-content: start;
    }

    .item-right {
      grid-row: 2 / 3;
      align-items: start;
      margin-top: 1.5rem;
    }
  }
</style>
