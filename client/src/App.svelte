<script>
  import Home from "./routes/Home.svelte";
  import Router from "svelte-spa-router";
  import MangaDetails from "./routes/MangaDetails.svelte";
  import NotFound from "./routes/NotFound.svelte";

  let routes = {
    "/": Home,
    "/manga/:id": MangaDetails,
    "*": NotFound,
  };
</script>

<main>
  <Router {routes} />
</main>
