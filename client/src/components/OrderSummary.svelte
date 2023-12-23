<script lang="ts">
  import { getTotalValue } from "../stores/cart.store";
  import cartStore from "../stores/cart.store";
  import Button from "./Button.svelte";

  let totalValue: string;

  const fetchPaymentMethods = async () => {
    let response = await fetch("http://localhost:3000/payment");
    if (response.ok) {
      let paymentMethods = await response.json();
      return paymentMethods;
    } else {
      let error = await response.json();
      throw new Error(error.message);
    }
  };

  const updateTotalValue = () => {
    totalValue = getTotalValue();
  };

  $: $cartStore, updateTotalValue();
</script>

{#await fetchPaymentMethods()}
  <p>Loading...</p>
{:then paymentMethods}
  <div class="order-summary">
    <h1 class="order-summary__heading">Order Summary</h1>
    <label for="payment-method" class="order-summary__label"
      >Payment method</label
    >
    <select id="payment-method" class="order-summary__select">
      {#each paymentMethods as method (method.payment_method_id)}
        <option>{method.name}</option>
      {/each}
    </select>
    <h2 class="order-summary__total">Order total: {totalValue} PLN</h2>
    <Button text="Checkout" />
  </div>
{:catch error}
  <p class="error error--server">{error}</p>
{/await}

<style>
  .order-summary {
    background-color: #282628;
    border-radius: 0.5rem;
    padding: 2rem;
    color: white;
    max-width: 350px;
    width: 100%;
  }

  .order-summary__label {
    display: block;
    margin-top: 1.5rem;
  }

  .order-summary__select {
    font-size: 1rem;
    margin-top: 0.5rem;
  }

  .order-summary__total {
    margin-top: 1.5rem;
  }

  @media (max-width: 1000px) {
    .order-summary {
      max-width: unset;
    }
  }
</style>
