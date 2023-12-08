import { get, writable, derived } from "svelte/store";
import type { Manga } from "../types/manga";

const mangaStore = writable<Manga[]>([]);
const serverError = writable({ isError: false, message: "" });

const filteredText = writable<string>("");
const filteredMangaStore = derived(
  [mangaStore, filteredText],
  ([$mangaStore, $filteredText]) => {
    return $mangaStore.filter((manga) =>
      manga.title.toLowerCase().includes($filteredText.toLowerCase())
    );
  }
);

const fetchMangas = async () => {
  try {
    const response = await fetch("http://localhost:3000/mangas");
    if (!response.ok) {
      let error = await response.json();
      throw new Error(error.message);
    }
    const mangas = await response.json();
    mangaStore.set(mangas);
  } catch (e: any) {
    serverError.set({ isError: true, message: e.message });
  }
};

const fetchMangaDetails = async (manga_id: number) => {
  if (!get(mangaStore).find((manga) => manga.manga_id === manga_id)?.fetched) {
    try {
      const response = await fetch(`http://localhost:3000/mangas/${manga_id}`);
      if (!response.ok) {
        let error = await response.json();
        throw new Error(error.message);
      }
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
    } catch (e: any) {
      serverError.set({ isError: true, message: e.message });
    }
  }
};

fetchMangas();

export {
  mangaStore,
  fetchMangaDetails,
  serverError,
  filteredMangaStore,
  filteredText,
};
