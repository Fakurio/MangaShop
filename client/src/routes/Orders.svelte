<script lang="ts">
  import Header from "../components/Header.svelte";
  import OrderList from "../components/OrderList.svelte";
  import {fetchOrderStatuses, SortFilter, sortFilter, statusFilter} from "../stores/order.store";
  import {Button} from "$lib/components/ui/button";
  import * as Select from "$lib/components/ui/select";
  import {Skeleton} from "$lib/components/ui/skeleton";

  let selectedStatusFilter = $state<string>("Pending");
  let selectedSortFilter = $state<SortFilter>(SortFilter.DATE_DESC);

  const applyStatusFilter = () => {
    statusFilter.set(selectedStatusFilter);
  };

  const applySortFilter = () => {
    sortFilter.set(selectedSortFilter);
  };
</script>

<Header />
<main class="max-w-[1300px] mx-auto mt-8 px-4 pb-4">
  <header class="text-center border-border border-2 rounded-2xl p-4">
    <h1 class="font-bold text-xl">My Orders</h1>
    <div class="flex justify-evenly items-center mt-5 filters">
      <div class="flex justify-center items-center gap-4">
        {#await fetchOrderStatuses()}
          <Skeleton class="h-[40px] border border-card-foreground w-[200px]"/>
        {:then statuses}
          <Button onclick={applyStatusFilter}>Filter</Button>
          <Select.Root type="single" bind:value={selectedStatusFilter}>
            <Select.Trigger class="w-[180px]">
              {selectedStatusFilter || "Select status filter"}
            </Select.Trigger>
            <Select.Content>
              {#each statuses as status}
                <Select.Item value={status}>{status}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        {/await}
      </div>
      <div class="flex justify-center items-center gap-4">
        <Select.Root type="single" bind:value={selectedSortFilter}>
          <Select.Trigger class="w-[180px]">
            {selectedSortFilter || "Select sort filter"}
          </Select.Trigger>
          <Select.Content>
            <Select.Item value={SortFilter.DATE_DESC}>{SortFilter.DATE_DESC}</Select.Item>
            <Select.Item value={SortFilter.DATE_ASC}>{SortFilter.DATE_ASC}</Select.Item>
            <Select.Item value={SortFilter.PRICE_DESC}>{SortFilter.PRICE_DESC}</Select.Item>
            <Select.Item value={SortFilter.PRICE_ASC}>{SortFilter.PRICE_ASC}</Select.Item>
          </Select.Content>
        </Select.Root>
        <Button onclick={applySortFilter}>Sort</Button>
      </div>
    </div>
  </header>
  <OrderList />
</main>

<style>
  @media (max-width: 800px) {
    .filters {
      flex-wrap: wrap;
      gap: 2rem;
    }
  }
</style>
