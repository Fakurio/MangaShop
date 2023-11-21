<script lang="ts">
  import { link } from "svelte-spa-router";
  export let title: string;
  export let img_url: string;
  export let price: number;
  export let manga_id: number;
</script>

<div>
  <h2><a href="/manga/{manga_id}" use:link>{title}</a></h2>
  <img src={img_url} alt={title} />
  <p>{price} PLN</p>
</div>
