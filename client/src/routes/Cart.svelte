<script lang="ts">
  import Header from "../components/Header.svelte";
  import CartComponent from "../components/CartComponent.svelte";
  import OrderSummary from "../components/OrderSummary.svelte";
  import cartStore from "../stores/cart.store";
</script>

<Header />
<div class="container">
  <main>
    <CartComponent />
    {#if $cartStore.length > 0}
      <OrderSummary />
    {/if}
  </main>
</div>

<style>
  main {
    padding-inline: 2rem;
    padding-bottom: 1rem;
    display: flex;
    align-items: flex-start;
    gap: 5rem;
  }

  .container {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }

  @media (max-width: 1000px) {
    main {
      flex-direction: column;
    }
  }

  @media (max-width: 500px) {
    main {
      padding-inline: 0;
    }
  }
</style>
