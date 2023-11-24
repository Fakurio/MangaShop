import { get, writable } from "svelte/store";
import type { Manga } from "../types/manga";

const mangaStore = writable<Manga[]>([]);

const fetchMangas = async () => {
  try {
    const response = await fetch("http://localhost:3000/mangas");
    const mangas = await response.json();
    mangaStore.set(mangas);
  } catch (e) {
    console.log(e);
  }
};

const fetchMangaDetails = async (manga_id: number) => {
  try {
    if (
      !get(mangaStore).find((manga) => manga.manga_id === manga_id)?.fetched
    ) {
      const response = await fetch(`http://localhost:3000/mangas/${manga_id}`);
      const mangaData = await response.json();
      mangaStore.update((mangas: Manga[]) => {
        return mangas.map((manga) => {
          if (manga.manga_id === manga_id) {
            return {
              ...manga,
              description: mangaData.description,
              author: mangaData.author,
              genres: mangaData.genres,
              reviews: mangaData.reviews,
              stock_quantity: mangaData.stock_quantity,
              fetched: true,
            };
          } else {
            return manga;
          }
        });
      });
    }
  } catch (e) {
    console.log(e);
  }
};

fetchMangas();

export { mangaStore, fetchMangaDetails };
