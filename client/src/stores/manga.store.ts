import { get, writable, derived } from "svelte/store";
import type { Manga } from "../types/manga";
import type { PriceRange } from "../types/price-range";

const mangaStore = writable<Manga[]>([]);
const serverError = writable({ isError: false, message: "" });

const filteredText = writable<string>("");
const filteredGenres = writable<string[]>([]);
const filteredPriceRange = writable<PriceRange>({
  from: 0,
  to: Number.POSITIVE_INFINITY,
});
const filteredMangaStore = derived(
  [mangaStore, filteredText, filteredGenres, filteredPriceRange],
  ([$mangaStore, $filteredText, $filteredGenres, $filteredPriceRange]) => {
    return $mangaStore
      .filter((manga) => {
        let isProper = true;
        for (let selectedGenre of $filteredGenres) {
          let genreNames = manga.genres.map((genre) => genre.name);
          if (!genreNames.includes(selectedGenre)) {
            isProper = false;
          }
        }
        return isProper;
      })
      .filter((manga) => {
        return (
          manga.price >= $filteredPriceRange.from &&
          manga.price <= $filteredPriceRange.to
        );
      })
      .filter((manga) => {
        return manga.title.toLowerCase().includes($filteredText.toLowerCase());
      });
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
  filteredGenres,
  filteredPriceRange,
};
