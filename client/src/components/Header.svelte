<script lang="ts">
  import { link } from "svelte-spa-router";
  import { onMount } from "svelte";
  import { authStore, logout } from "../stores/auth.store";
  import Icon from "./Icon.svelte";
  import Button from "./Button.svelte";

  let isCartIconHidden = false;

  const toggleCartIcon = () => {
    isCartIconHidden = window.innerWidth < 500;
  };

  onMount(() => {
    toggleCartIcon();

    window.addEventListener("resize", toggleCartIcon);

    return () => window.removeEventListener("resize", toggleCartIcon);
  });
</script>

<header class="header">
  <div class="header__left-block">
    <a href="/" use:link>Home</a>
    <a href="/" use:link>My orders</a>
  </div>
  <div class="header__right-block">
    {#if !isCartIconHidden}
      <Icon type="cart" />
    {:else}
      <span>Cart</span>
    {/if}
    {#if !$authStore}
      <span><a href="/register" use:link>Register</a></span>
      <span><a href="/login" use:link>Login</a></span>
    {:else}
      <span>{$authStore.username}</span>
      <button class="right-block__logout" on:click={() => logout()}
        >Logout</button
      >
    {/if}
  </div>
</header>

<style>
  .header {
    color: #777676;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    padding: 1.5rem 5rem;
  }

  .header__left-block {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .header__right-block {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .right-block__logout {
    color: inherit;
    font-size: 1rem;
  }

  a:hover {
    color: #e58e27;
  }

  @media (max-width: 500px) {
    .header * {
      width: 100%;
      font-size: 1.2rem;
      text-align: center;
    }

    .header__right-block {
      margin-top: 1rem;
    }
  }
</style>
