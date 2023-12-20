<script lang="ts">
  import Header from "../components/Header.svelte";
  import CartComponent from "../components/CartComponent.svelte";
</script>

<Header />
<main>
  <CartComponent />
  <!-- OrderSummary -->
</main>

<style>
  main {
    padding-inline: 2rem;
    padding-bottom: 1rem;
  }

  @media (max-width: 400px) {
    main {
      padding-inline: 0;
    }
  }
</style>
