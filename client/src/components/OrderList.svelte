<script lang="ts">
  import OrderItem from "./OrderItem.svelte";
  import { filteredOrderStore, fetchUserOrders } from "../stores/order.store";
  import {Skeleton} from "$lib/components/ui/skeleton";
  import * as Accordion from "$lib/components/ui/accordion/index.js";
</script>

{#await fetchUserOrders()}
  <Skeleton class="h-[300px] border border-card-foreground w-full mt-4"/>
{:then _}
  <Accordion.Root type="single" class="mt-4 flex flex-col gap-10">
    {#each $filteredOrderStore as order (order.order_id)}
      <OrderItem
              total={order.total_price}
              status={order.order_status} orderItems={order.orderItems} date={order.order_date}/>
    {/each}
  </Accordion.Root>
{/await}

