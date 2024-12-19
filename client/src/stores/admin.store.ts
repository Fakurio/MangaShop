import { writable } from "svelte/store";
import type { Manga } from "../types/manga";
import { catchError } from "../api/catchError";
import { makePrivateRequest } from "../api/makePrivateRequest";
import { UnauthorizedError } from "../api/errors/UnauthorizedError";
import { authStore } from "./auth.store";
import { replace } from "svelte-spa-router";

const adminMangaStore = writable<Manga[]>([]);
const adminMangaStoreError = writable<boolean>(false);

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

export { adminMangaStore, adminMangaStoreError, fetchMangaForAdmin };
