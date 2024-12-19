<script lang="ts">
  import { link } from "svelte-spa-router";
  import { authStore, logout } from "../stores/auth.store";
  import cartStore from "../stores/cart.store";
  import * as Sheet from "$lib/components/ui/sheet";
  import {Button} from "$lib/components/ui/button"
  import {Menu} from "lucide-svelte"
  import {ShoppingCart} from "lucide-svelte";
  import {HomeIcon} from "lucide-svelte";
  import {NotebookTabs} from "lucide-svelte";
  import {Warehouse} from "lucide-svelte";
  import {Drama} from "lucide-svelte";
  import {RoleEnum} from "../enums/role-enum";
</script>

<header class="header">
  <nav class="desktop-nav flex justify-between w-full">
    <div>
      {#if $authStore?.roles.includes(RoleEnum.ADMIN)}
        <Button variant="link" class="text-md">
          <a href="/admin" use:link>Inventory</a>
        </Button>
        <Button variant="link" class="text-md">
          <a href="/admin" use:link>Genres</a>
        </Button>
      {:else}
        <Button variant="link" class="text-md">
          <a href="/" use:link>Home</a>
        </Button>
      {/if}
      {#if $authStore?.roles.includes(RoleEnum.USER)}
        <Button variant="link" class="text-md">
          <a href="/orders" use:link>My orders</a>
        </Button>
      {/if}
    </div>

    <div class="flex justify-between items-center gap-4">
      {#if !$authStore?.roles.includes(RoleEnum.ADMIN)}
        <a href="/cart" use:link class="relative">
          {#if $cartStore.length > 0}
            <span class="cart-count bg-primary text-primary-foreground">{$cartStore.length}</span>
          {/if}
          <ShoppingCart />
        </a>
      {/if}

      {#if !$authStore}
        <Button variant="secondary">
          <a href="/register" use:link>Register</a>
        </Button>
        <Button>
          <a href="/login" use:link>Login</a>
        </Button>
      {:else}
        <span class="font-bold text-primary-foreground">{$authStore.username}</span>
        <Button onclick={logout} class="font-bold">Logout</Button>
      {/if}
    </div>
  </nav>

  <div class="mobile-nav">
    <Sheet.Root>
      <Sheet.Trigger>
        <Menu/>
      </Sheet.Trigger>
      <Sheet.Content class="w-[300px]">
        <nav class="flex gap-6 flex-col">
          {#if $authStore?.roles.includes(RoleEnum.ADMIN)}
            <a href="/admin" use:link class="flex">
              <Warehouse/>
              <span class="ml-2">Inventory</span>
            </a>
            <a href="/admin" use:link class="flex">
              <Drama/>
              <span class="ml-2">Genres</span>
            </a>
          {:else}
            <a href="/" use:link class="flex">
              <HomeIcon/>
              <span class="ml-2">Home</span>
            </a>
          {/if}

          {#if $authStore?.roles.includes(RoleEnum.USER)}
            <a href="/orders" use:link class="flex">
              <NotebookTabs/>
              <span class="ml-2">My orders</span>
            </a>
          {/if}

          {#if !$authStore?.roles.includes(RoleEnum.ADMIN)}
            <a href="/cart" use:link class="flex relative">
              {#if $cartStore.length > 0}
                <span class="cart-count bg-primary text-primary-foreground">{$cartStore.length}</span>
              {/if}
              <ShoppingCart/>
              <span class="ml-2">Cart</span>
            </a>
          {/if}

          {#if !$authStore}
            <Button variant="secondary">
              <a href="/register" use:link>Register</a>
            </Button>
            <Button>
              <a href="/login" use:link>Login</a>
            </Button>
          {:else}
            <Button onclick={logout}>Logout</Button>
          {/if}
        </nav>
      </Sheet.Content>
    </Sheet.Root>
  </div>
</header>

<style>
  .header {
    padding: 1.5rem 5rem;
  }

  .cart-count {
    position: absolute;
    top: -0.5rem;
    left: -0.5rem;
    border-radius: 50%;
    width: 1rem;
    height: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.8rem;
    z-index: 1;
    font-weight: 700;
  }

  @media (min-width: 600px) {
    .mobile-nav {
      display: none
    }
  }

  @media (max-width: 600px) {
    .header {
      padding-inline: 2rem;
    }

    .desktop-nav {
      display: none
    }
  }

  @media (max-width: 380px) {
    .header {
      padding-inline: 1rem;
    }
  }

</style>
