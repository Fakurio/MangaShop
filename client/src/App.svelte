<script>
  import "./app.css";
  // @ts-nocheck
  
  import Home from "./routes/Home.svelte";
  import Router from "svelte-spa-router";
  import MangaDetails from "./routes/MangaDetails.svelte";
  import Register from "./routes/Register.svelte";
  import Login from "./routes/Login.svelte";
  import Cart from "./routes/Cart.svelte";
  import Orders from "./routes/Orders.svelte";
  import {wrap} from "svelte-spa-router/wrap";
  import {authStore, refreshToken} from "./stores/auth.store";
  import {get} from "svelte/store";
  import {getCartFromLocalStorage} from "./stores/cart.store";

  const verifyRefreshToken = async () => {
    if (get(authStore)) return true;
    try {
        await refreshToken();
    } catch (error) {}
    return true;
  };
  
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
      "/cart": wrap({
          component: Cart,
          conditions: [() => getCartFromLocalStorage(), () => verifyRefreshToken()],
      }),
      "/orders": wrap({
        component: Orders,
        conditions: [
            () => getCartFromLocalStorage(),
            () => verifyRefreshToken(),
        ],
      }),
      "/login": Login,
  };
</script>

<Router {routes} restoreScrollState={true}/>

