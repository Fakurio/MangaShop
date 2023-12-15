import { writable } from "svelte/store";
import type { LoggedInUser } from "../types/logged-in-user";

const authStore = writable<LoggedInUser>();

export { authStore };
