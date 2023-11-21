import { writable } from "svelte/store";

const mangaStore = writable([]);

const fetchMangas = async () => {
  try {
    const response = await fetch("http://localhost:3000/mangas");
    const mangas = await response.json();
    mangaStore.set(mangas);
  } catch (e) {
    console.log(e);
  }
};

fetchMangas();

export { mangaStore };
