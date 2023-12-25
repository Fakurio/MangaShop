<script lang="ts">
  import type { OrderItem } from "../types/order-item";
  import { v4 as uuidv4 } from "uuid";
  import { mangaStore } from "../stores/manga.store";
  import { get } from "svelte/store";
  import { onMount } from "svelte";

  export let status: string;
  export let date: Date;
  export let total: number;
  export let orderItems: OrderItem[];

  let mangaImgs: string[] = [];
  let mangaPrices: number[] = [];
  let isLoading = true;

  const getMangaInfo = () => {
    orderItems.forEach((item) => {
      let manga = get(mangaStore).find(
        (manga) => manga.manga_id === item.manga_id
      );

      if (manga) {
        mangaImgs.push(manga.img_url);
        mangaPrices.push(manga.price);
      }
    });
    isLoading = false;
  };

  onMount(() => {
    getMangaInfo();
  });
</script>

{#if !isLoading}
  <details class="order-item">
    <summary class="item__summary">
      <div class="item__left-block">
        <p class="left-block__info">
          Status: <span class="accent">{status}</span>
        </p>
        <p class="left-block__info">
          Order value: <span class="accent">{total} PLN</span>
        </p>
        <p class="left-block__info">
          Order date: <span class="accent">{date}</span>
        </p>
      </div>
      <div class="item__right-block">
        {#each mangaImgs as img (uuidv4())}
          <div>
            <img src={img} alt="" />
          </div>
        {/each}
      </div>
    </summary>
    <div class="item__body">
      {#each orderItems as item, index (uuidv4())}
        <div class="item__body__details">
          <img src={mangaImgs[index]} alt="" />
          <p>Quantity: {item.quantity}</p>
          <p>Price: {mangaPrices[index]} PLN</p>
        </div>
      {/each}
    </div>
  </details>
{/if}

<style>
  .order-item {
    background-color: #383638;
    border-radius: 0.5rem;
    padding: 0.5rem;
    cursor: pointer;
  }

  .item__summary {
    display: flex;
    flex-wrap: wrap;
    gap: 5rem;
  }

  .item__left-block {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    gap: 1rem;
  }

  .left-block__info {
    font-size: 1.1rem;
    font-weight: 700;
  }

  .accent {
    color: #e58e27;
  }

  .item__right-block {
    display: flex;
    flex-wrap: wrap;
    gap: 3rem;
  }

  .item__body {
    margin-top: 2rem;
    background-color: #282628;
    border-radius: 0.5rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    font-size: 1.1rem;
  }

  .item__body__details {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .item__right-block img,
  .item__body img {
    height: 150px;
    width: 100px;
  }

  @media (max-width: 500px) {
    .item__summary {
      gap: 2rem;
    }

    .item__left-block {
      margin: 0 auto;
    }

    .item__right-block {
      justify-content: center;
      width: 100%;
    }

    .item__body {
      gap: 3rem;
    }

    .item__body__details {
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>
