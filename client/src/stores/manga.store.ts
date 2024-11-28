import { get, writable, derived } from "svelte/store";
import type { Manga } from "../types/manga";
import type { PriceRange } from "../types/price-range";
import { catchError } from "../api/catchError";
import { makeRequest } from "../api/makeRequest";
import type { Genre } from "../types/genre";

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
  },
);

const fetchGenres = async () => {
  const [error, data] = await catchError<Genre[]>(
    makeRequest("/genres", "GET"),
  );

  if (!error) {
    return data;
  } else {
    throw error;
  }
};

const fetchMangas = async () => {
  const [error, data] = await catchError(makeRequest("/mangas", "GET"));

  if (error) {
    serverError.set({ isError: true, message: error.message });
  } else {
    mangaStore.set(data);
  }
};

const fetchMangaDetails = async (manga_id: number) => {
  if (!get(mangaStore).find((manga) => manga.manga_id === manga_id)?.fetched) {
    const [error, data] = await catchError<Manga>(
      makeRequest(`/mangas/${manga_id}`, "GET"),
    );

    if (error) {
      serverError.set({ isError: true, message: error.message });
    } else {
      mangaStore.update((mangas: Manga[]) => {
        return mangas.map((manga) => {
          if (manga.manga_id === manga_id) {
            return {
              ...manga,
              description: data.description,
              author: data.author,
              genres: data.genres,
              reviews: data.reviews,
              stock_quantity: data.stock_quantity,
              fetched: true,
            };
          } else {
            return manga;
          }
        });
      });
    }
  }
};

const getMangaPrice = (manga_id: number) => {
  return get(mangaStore).find((manga) => manga.manga_id === manga_id)?.price;
};

export {
  mangaStore,
  fetchMangaDetails,
  serverError,
  filteredMangaStore,
  filteredText,
  filteredGenres,
  filteredPriceRange,
  fetchMangas,
  fetchGenres,
  getMangaPrice,
};
