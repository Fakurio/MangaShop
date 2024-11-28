<script lang="ts">
  import { getTotalValue } from "../stores/cart.store";
  import cartStore from "../stores/cart.store";
  import Button from "./Button.svelte";
  import {derived} from "svelte/store";
  import {fetchPaymentMethods, createOrder} from "../stores/order.store";


  const totalValue = derived(cartStore, _ => {
    return getTotalValue()
  })
  let paymentMethod: string;
  let serverResponse: string = "";
  let isServerError: boolean = false;

  const handleCreatingOrder = async () => {
    const [isError, message] = await createOrder(paymentMethod, $totalValue);
    if (isError) {
      isServerError = true;
    }
    serverResponse = message
  }
</script>

{#if serverResponse}
  <p
    class={`server-response ${
      isServerError ? "server-response--error" : undefined
    }`}
  >
    {serverResponse}
  </p>
{/if}
{#await fetchPaymentMethods()}
  <p>Loading...</p>
{:then paymentMethods}
  <div class="order-summary">
    <h1 class="order-summary__heading">Order Summary</h1>
    <label for="payment-method" class="order-summary__label"
      >Payment method</label
    >
    <select
      id="payment-method"
      class="order-summary__select"
      bind:value={paymentMethod}
    >
      {#each paymentMethods as method (method.payment_method_id)}
        <option value={method.name}>{method.name}</option>
      {/each}
    </select>
    <h2 class="order-summary__total">Order total: {$totalValue} PLN</h2>
    <Button text="Checkout" onClick={handleCreatingOrder} />
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
