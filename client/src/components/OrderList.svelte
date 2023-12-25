<script lang="ts">
  import { usePrivateInterceptor } from "../inteceptors/private";
  import OrderItem from "./OrderItem.svelte";

  const fetchUserOrders = async () => {
    let response = await usePrivateInterceptor("order/all", "GET");
    let orders = await response.json();
    return orders;
  };
</script>

{#await fetchUserOrders()}
  <p>Loading...</p>
{:then orders}
  <div class="order-list">
    {#each orders as order (order.order_id)}
      <OrderItem
        total={order.total_price}
        status={order.order_status}
        orderItems={order.orderItems}
        date={order.order_date}
      />
    {/each}
  </div>
{/await}

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
