<script>
  import "./app.css";
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
  import AdminDashboard from "./routes/AdminDashboard/AdminDashboard.svelte";
  import { RoleEnum } from "./enums/role-enum";
  import AddManga from "./routes/AddManga.svelte";

  const verifyRefreshToken = async () => {
    if (get(authStore)) return true;
    try {
      await refreshToken();
    } catch (error) {}
    return true;
  };

  const blockAdmin = () => {
    const isAdminLoggedIn =
      $authStore !== null && $authStore.roles.includes(RoleEnum.ADMIN);
    if (isAdminLoggedIn) {
      replace("/admin");
    }
    return true;
  };

  const allowAdmin = () => {
    const isAdminLoggedIn =
      $authStore !== null && $authStore.roles.includes(RoleEnum.ADMIN);
    if (!isAdminLoggedIn) {
      replace("/login");
    }
    return true;
  };

  let routes = {
    "/": wrap({
      component: Home,
      conditions: [
        () => getCartFromLocalStorage(),
        () => verifyRefreshToken(),
        () => blockAdmin(),
      ],
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
      conditions: [() => getCartFromLocalStorage(), () => verifyRefreshToken()],
    }),
    "/admin": wrap({
      component: AdminDashboard,
      conditions: [() => verifyRefreshToken(), () => allowAdmin()],
    }),
    "/admin/add-manga": wrap({
      component: AddManga,
      conditions: [() => verifyRefreshToken(), () => allowAdmin()],
    }),
    "/login": Login,
  };
</script>

<Router {routes} />
