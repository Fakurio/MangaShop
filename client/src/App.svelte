<script>
  import "./app.css";
  // @ts-nocheck
  
  import Home from "./routes/Home.svelte";
  import Router, {replace} from "svelte-spa-router";
  import MangaDetails from "./routes/MangaDetails.svelte";
  import Register from "./routes/Register.svelte";
  import Login from "./routes/Login.svelte";
  import Cart from "./routes/Cart.svelte";
  import Orders from "./routes/Orders.svelte";
  import {wrap} from "svelte-spa-router/wrap";
  import {authStore, refreshToken} from "./stores/auth.store";
  import {get} from "svelte/store";
  import {getCartFromLocalStorage} from "./stores/cart.store";
  import {fetchMangas} from "./stores/manga.store";
  import {onMount} from "svelte";
  
  const verifyRefreshToken = async () => {
    if (get(authStore)) return true;
    await refreshToken();
    return true;
  };
  
  const isLoggedIn = () => {
    if (!get(authStore)) {
      replace("/login");
    }
    return true;
  };
  
  onMount(async () => {
    await fetchMangas();
  });
  
  let routes = {
      "/": wrap({
          component: Home,
          conditions: [() => getCartFromLocalStorage(), () => {verifyRefreshToken(); return true;}],
      }),
      "/manga/:id": wrap({
          component: MangaDetails,
          conditions: [() => getCartFromLocalStorage(), () => verifyRefreshToken()],
      }),
      "/register": Register,
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
      "/login": Login,
  };
</script>

<Router {routes} restoreScrollState={true}/>

