<script lang="ts">
  import { mangaStore } from "../stores/manga.store";
  import MangaCard from "../components/MangaCard.svelte";
</script>

<h1>Mangas</h1>
<ul>
  {#each $mangaStore as manga (manga.manga_id)}
    <li>
      <MangaCard
        manga_id={manga.manga_id}
        title={manga.title}
        img_url={manga.img_url}
        price={manga.price}
      />
    </li>
  {/each}
</ul>
