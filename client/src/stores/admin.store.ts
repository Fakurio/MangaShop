import { get, writable } from "svelte/store";
import type { Manga } from "../types/manga";
import { catchError } from "../api/catchError";
import { makePrivateRequest } from "../api/makePrivateRequest";
import { UnauthorizedError } from "../api/errors/UnauthorizedError";
import { authStore } from "./auth.store";
import { replace } from "svelte-spa-router";
import type { MangaForm } from "src/types/manga-form";
import { BadRequestError } from "../api/errors/BadRequestError";
import type { GenreForm } from "../types/genre-form";
import type { Genre } from "../types/genre";
import { makeRequest } from "../api/makeRequest";

const adminMangaStore = writable<Manga[]>([]);
const adminMangaStoreError = writable<boolean>(false);
const adminGenreStore = writable<Genre[]>([]);

const fetchMangaForAdmin = async () => {
  const [error, data] = await catchError<Manga[]>(
    makePrivateRequest("/mangas/admin", "GET"),
  );

  if (error) {
    if (error instanceof UnauthorizedError) {
      authStore.set(null);
      await replace("/login");
    } else {
      adminMangaStoreError.set(true);
    }
  } else {
    adminMangaStore.set(data);
  }
};

const fetchGenresToAdminStore = async () => {
  const [error, data] = await catchError<Genre[]>(
    makeRequest("/genres", "GET"),
  );

  if (!error) {
    adminGenreStore.set(data);
  } else {
    throw error;
  }
};

const addManga = async (
  mangaData: MangaForm,
): Promise<[undefined, any] | [BadRequestError]> => {
  const [error, data] = await catchError(
    makePrivateRequest("/mangas", "POST", undefined, mangaData),
  );

  if (error) {
    if (error instanceof UnauthorizedError) {
      authStore.set(null);
      await replace("/login");
    } else if (error instanceof BadRequestError) {
      return [error];
    } else {
      throw error;
    }
  }

  adminMangaStore.update((mangas) => [...mangas, data]);
  return [undefined, data];
};

const findManga = (id: string) => {
  return get(adminMangaStore).find((manga) => manga.manga_id === parseInt(id));
};

const updateManga = async (
  id: string,
  mangaDto: MangaForm,
): Promise<[undefined, any] | [BadRequestError]> => {
  const [error, data] = await catchError(
    makePrivateRequest(`/mangas/${id}`, "PUT", undefined, mangaDto),
  );

  if (error) {
    if (error instanceof UnauthorizedError) {
      authStore.set(null);
      await replace("/login");
    } else if (error instanceof BadRequestError) {
      return [error];
    } else {
      throw error;
    }
  }

  return [undefined, data];
};

const deleteManga = async (id: string) => {
  const [error] = await catchError(
    makePrivateRequest(`/mangas/${id}`, "DELETE"),
  );

  if (error) {
    if (error instanceof UnauthorizedError) {
      authStore.set(null);
      await replace("/login");
    } else {
      adminMangaStoreError.set(true);
    }
  } else {
    adminMangaStore.update((mangas) =>
      mangas.filter((manga) => manga.manga_id !== parseInt(id)),
    );
  }
};

const addGenre = async (
  genreData: GenreForm,
): Promise<[undefined, any] | [BadRequestError]> => {
  const [error, data] = await catchError(
    makePrivateRequest("/genres", "POST", undefined, genreData),
  );

  if (error) {
    if (error instanceof UnauthorizedError) {
      authStore.set(null);
      await replace("/login");
    } else if (error instanceof BadRequestError) {
      return [error];
    } else {
      throw error;
    }
  }

  adminGenreStore.update((genres) => [...genres, data]);
  return [undefined, data];
};

const findGenre = (id: string) => {
  return get(adminGenreStore).find((genre) => genre.genre_id === parseInt(id));
};

const updateGenre = async (
  id: string,
  genreDto: GenreForm,
): Promise<[undefined, any] | [BadRequestError]> => {
  const [error, data] = await catchError(
    makePrivateRequest(`/genres/${id}`, "PUT", undefined, genreDto),
  );

  if (error) {
    if (error instanceof UnauthorizedError) {
      authStore.set(null);
      await replace("/login");
    } else if (error instanceof BadRequestError) {
      return [error];
    } else {
      throw error;
    }
  }

  return [undefined, data];
};

const deleteGenre = async (id: string) => {
  const [error] = await catchError(
    makePrivateRequest(`/genres/${id}`, "DELETE"),
  );

  if (error) {
    if (error instanceof UnauthorizedError) {
      authStore.set(null);
      await replace("/login");
    } else if (error instanceof BadRequestError) {
      return error;
    }
  } else {
    adminGenreStore.update((genres) =>
      genres.filter((genre) => genre.genre_id !== parseInt(id)),
    );
  }
};

export {
  adminMangaStore,
  adminMangaStoreError,
  adminGenreStore,
  fetchMangaForAdmin,
  fetchGenresToAdminStore,
  addManga,
  findManga,
  updateManga,
  deleteManga,
  addGenre,
  findGenre,
  updateGenre,
  deleteGenre,
};
