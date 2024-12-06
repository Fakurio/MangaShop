<script lang="ts">
  import Header from "../components/Header.svelte";
  import CartComponent from "../components/CartComponent.svelte";
  import OrderSummary from "../components/OrderSummary.svelte";
  import cartStore from "../stores/cart.store";
  import {fetchMangaDetails, fetchMangas} from "../stores/manga.store";
  import {Skeleton} from "$lib/components/ui/skeleton";
  import {get} from "svelte/store";

  const fetchContent = async () => {
    await fetchMangas()
    for(const item of get(cartStore)) {
      await fetchMangaDetails(item.manga_id)
    }
  }

</script>

<Header />
<main class="px-3 md:px-8 pb-4 flex gap-10 justify-center items-start mt-8">
  {#await fetchContent()}
    <Skeleton class="h-[300px] border border-card-foreground w-full"/>
  {:then _}
    <CartComponent />
    {#if $cartStore.length > 0}
      <OrderSummary />
    {/if}
  {/await}
</main>

<style>
  @media (max-width: 1200px) {
    main {
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
