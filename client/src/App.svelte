<script>
  // @ts-nocheck

  import Home from "./routes/Home.svelte";
  import Router from "svelte-spa-router";
  import MangaDetails from "./routes/MangaDetails.svelte";
  import Register from "./routes/Register.svelte";
  import Login from "./routes/Login.svelte";
  import { wrap } from "svelte-spa-router/wrap";
  import { authStore, refreshToken } from "./stores/auth.store";
  import { get } from "svelte/store";

  const verifyRefreshToken = () => {
    if (!get(authStore)) {
      try {
        refreshToken();
      } finally {
        return true;
      }
    } else {
      return true;
    }
  };

  let routes = {
    "/": wrap({
      component: Home,
      conditions: [() => verifyRefreshToken()],
    }),
    "/manga/:id": wrap({
      component: MangaDetails,
      conditions: [() => verifyRefreshToken()],
    }),
    "/register": Register,
    "/login": Login,
  };
</script>

<Router {routes} />
