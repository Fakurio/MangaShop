<script lang="ts">
  import { link } from "svelte-spa-router";
  import Icon from "./Icon.svelte";
</script>

<header class="header">
  <div class="header__left-block">
    <a href="/" use:link>Home</a>
    <a href="/" use:link>My orders</a>
  </div>
  <div class="header__right-block">
    <Icon type="cart" />
    <span>Username</span>
  </div>
</header>

<style>
  .header {
    color: #777676;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
  }

  .header__left-block {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .header__right-block {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  a:hover {
    color: #e58e27;
  }
</style>
