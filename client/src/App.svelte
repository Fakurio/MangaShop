<script>
  // @ts-nocheck

  import Home from "./routes/Home.svelte";
  import Router, { replace } from "svelte-spa-router";
  import MangaDetails from "./routes/MangaDetails.svelte";
  import Register from "./routes/Register.svelte";
  import Login from "./routes/Login.svelte";
  import Cart from "./routes/Cart.svelte";
  import Orders from "./routes/Orders.svelte";
  import { wrap } from "svelte-spa-router/wrap";
  import { authStore, refreshToken } from "./stores/auth.store";
  import { get } from "svelte/store";
  import { getCartFromLocalStorage } from "./stores/cart.store";
  import { fetchMangas } from "./stores/manga.store";
  import { onMount } from "svelte";

  let isLoading = true;

  const verifyRefreshToken = async () => {
    if (get(authStore)) return true;

    try {
      await refreshToken();
    } catch (error) {}

    return true;
  };

  const isLoggedIn = () => {
    if (!get(authStore)) {
      replace("/login");
    }
    return true;
  };

  onMount(async () => {
    try {
      await fetchMangas();
    } finally {
      isLoading = false;
    }
  });

  let routes = {
    "/": wrap({
      component: Home,
      conditions: [() => getCartFromLocalStorage(), () => verifyRefreshToken()],
    }),
    "/manga/:id": wrap({
      component: MangaDetails,
      conditions: [() => getCartFromLocalStorage(), () => verifyRefreshToken()],
    }),
    "/register": Register,
    "/login": Login,
    "/cart": wrap({
      component: Cart,
      conditions: [() => getCartFromLocalStorage(), () => verifyRefreshToken()],
    }),
    "/orders": wrap({
      component: Orders,
      conditions: [
        () => getCartFromLocalStorage(),
        async () => await verifyRefreshToken(),
        () => isLoggedIn(),
      ],
    }),
  };
</script>

{#if !isLoading}
  <Router {routes} />
{/if}
