<script lang="ts">
  import OrderItem from "./OrderItem.svelte";
  import { filteredOrderStore, fetchUserOrders } from "../stores/order.store";
  import { onMount } from "svelte";

  let isLoading = true;

  onMount(async () => {
    try {
      await fetchUserOrders();
    } finally {
      isLoading = false;
    }
  });
</script>

{#if !isLoading}
  <div class="order-list">
    {#each $filteredOrderStore as order (order.order_id)}
      <OrderItem
        total={order.total_price}
        status={order.order_status}
        orderItems={order.orderItems}
        date={order.order_date}
      />
    {/each}
  </div>
{/if}

<style>
  .order-list {
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    gap: 3rem;
    background-color: #282628;
    padding: 1rem;
    border-radius: 0.5rem;
  }
</style>
