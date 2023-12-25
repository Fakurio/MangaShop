<script lang="ts">
  import Header from "../components/Header.svelte";
  import Button from "../components/Button.svelte";
  import OrderList from "../components/OrderList.svelte";
  import { usePrivateInterceptor } from "../inteceptors/private";

  const fetchOrderStatuses = async () => {
    let response = await usePrivateInterceptor("order/status", "GET");
    let orderStatuses = await response.json();
    return orderStatuses;
  };
</script>

<Header />
<div class="container">
  <main>
    <header>
      <h1>My Orders</h1>
      <div class="filters">
        <div class="filters__left">
          <Button text="Filter" className="filter-btn" />
          {#await fetchOrderStatuses()}
            <p>Loading...</p>
          {:then statuses}
            <select>
              {#each statuses as status}
                <option value={status}>{status}</option>
              {/each}
            </select>
          {/await}
        </div>
        <div class="filters__right">
          <Button text="Sort" className="filter-btn" />
          <select>
            <option>By date ascending</option>
            <option>By date descending</option>
            <option>By price ascending</option>
            <option>By price descending</option>
          </select>
        </div>
      </div>
    </header>
    <OrderList />
  </main>
</div>

<style>
  .container {
    max-width: 1300px;
    width: 100%;
    margin: 0 auto;
    color: white;
    margin-top: 2rem;
    padding-bottom: 1rem;
    padding-inline: 1rem;
  }

  header {
    text-align: center;
    background-color: #383638;
    border-radius: 0.5rem;
    padding-block: 1rem;
  }

  .filters {
    display: flex;
    justify-content: center;

    align-items: center;
    margin-top: 2rem;
    gap: 10rem;
  }

  .filters__left {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }

  .filters__right {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }

  .filters :global(.filter-btn) {
    margin-top: 0;
    padding: 0.3em 0.5em;
    width: 60px;
  }

  .filters select {
    padding: 0.3em;
    width: 150px;
  }

  @media (max-width: 500px) {
    .filters {
      flex-wrap: wrap;
      gap: 2rem;
    }
  }
</style>
