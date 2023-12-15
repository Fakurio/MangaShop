<script>
  import Home from "./routes/Home.svelte";
  import Router from "svelte-spa-router";
  import MangaDetails from "./routes/MangaDetails.svelte";
  import Register from "./routes/Register.svelte";
  import Login from "./routes/Login.svelte";

  let routes = {
    "/": Home,
    "/manga/:id": MangaDetails,
    "/register": Register,
    "/login": Login,
  };
</script>

<Router {routes} />
