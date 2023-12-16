<script lang="ts">
  import { link } from "svelte-spa-router";
  import { onMount } from "svelte";
  import { authStore, logout } from "../stores/auth.store";
  import Icon from "./Icon.svelte";

  let isCartIconHidden = false;
  let isMenuCollapsed = true;

  const toggleCartIcon = () => {
    isCartIconHidden = window.innerWidth < 500;
  };

  const toggleMenu = () => {
    isMenuCollapsed = !isMenuCollapsed;
  };

  onMount(() => {
    toggleCartIcon();

    window.addEventListener("resize", toggleCartIcon);

    return () => window.removeEventListener("resize", toggleCartIcon);
  });
</script>

<header class="header">
  {#if !isCartIconHidden}
    <div class="header__left-block">
      <a href="/" use:link>Home</a>
      {#if $authStore}
        <a href="/" use:link>My orders</a>
      {/if}
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
        <span class="current-user">{$authStore.username}</span>
        <button class="right-block__logout" on:click={() => logout()}
          >Logout</button
        >
      {/if}
    </div>
  {:else}
    <div class="mobile-header">
      <nav
        class={`mobile-header__nav ${isMenuCollapsed ? "closed" : "opened"}`}
      >
        <div class="header__left-block">
          <a href="/" use:link>Home</a>
          {#if $authStore}
            <a href="/" use:link>My orders</a>
          {/if}
        </div>
        <div class="header__right-block">
          {#if !isCartIconHidden}
            <Icon type="cart" />
          {:else}
            <a href="/" use:link>Cart</a>
          {/if}
          {#if !$authStore}
            <span><a href="/register" use:link>Register</a></span>
            <span><a href="/login" use:link>Login</a></span>
          {:else}
            <span class="current-user">{$authStore.username}</span>
            <button class="right-block__logout" on:click={() => logout()}
              >Logout</button
            >
          {/if}
        </div>
      </nav>
      <button on:click={() => toggleMenu()} class="hamburger">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>
    </div>
  {/if}
</header>

<style>
  .mobile-header {
    display: grid;
    grid-template-columns: 1fr min-content;
  }

  .mobile-header__nav {
    overflow: hidden;
    transition: max-height 0.4s ease-in-out;
  }

  .hamburger {
    height: 30px;
    min-width: 30px;
  }

  .closed {
    max-height: 0;
  }

  .opened {
    max-height: 300px;
  }

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
    font-weight: 700;
    cursor: pointer;
  }

  .right-block__logout:hover {
    color: #e58e27;
  }

  .current-user {
    font-weight: 700;
    color: #e58e27;
  }

  a:hover {
    color: #e58e27;
  }

  @media (max-width: 500px) {
    .header {
      padding-right: 2.5rem;
    }

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
