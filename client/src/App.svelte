<script>
  import Home from "./routes/Home.svelte";
  import Router from "svelte-spa-router";
  import MangaDetails from "./routes/MangaDetails.svelte";
  import NotFound from "./routes/NotFound.svelte";
  import Register from "./routes/Register.svelte";

  let routes = {
    "/": Home,
    "/manga/:id": MangaDetails,
    "/login": Register,
    "*": NotFound,
  };
</script>

<Router {routes} />
