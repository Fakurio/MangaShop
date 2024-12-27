<script lang="ts">
  import Header from "../components/Header.svelte";
  import {
    mangaFormSchema,
    type MangaForm as MangaFormT,
    type MangaFormErrors,
  } from "../types/manga-form";
  import { getErrorsFromZod } from "../utils/getErrorsFromZod";
  import * as Alert from "$lib/components/ui/alert/index.js";
  import { Toaster } from "$lib/components/ui/sonner";
  import { toast } from "svelte-sonner";
  import { findManga, updateManga } from "../stores/admin.store";
  import MangaForm from "../components/MangaForm.svelte";

  let { params }: { params: { id: string } } = $props();

  let updateMangaForm = $state<MangaFormT>({
    title: "",
    img_url: "",
    price: "",
    stock_quantity: null,
    author: "",
    description: "",
    genres: [],
  });

  let updateMangaFormErrors = $state<MangaFormErrors>({
    title: "",
    img_url: "",
    price: "",
    stock_quantity: "",
    author: "",
    description: "",
    genres: "",
  });

  let formRef = $state<HTMLFormElement>();
  let isMangaFound = $state<boolean>(true);

  $effect(() => {
    isMangaFound = true;
    const found = findManga(params.id);
    if (found) {
      updateMangaForm = { ...found, genres: found.genres.map((g) => g.name) };
    } else {
      isMangaFound = false;
    }
  });

  const handleFormSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const parsedForm = mangaFormSchema.safeParse(updateMangaForm);
    const errors = getErrorsFromZod(parsedForm);
    if (errors) {
      updateMangaFormErrors = errors;
    } else {
      try {
        const [errors, data] = await updateManga(params.id, updateMangaForm);
        if (errors) {
          // Server errors
          updateMangaFormErrors = errors.messages;
        } else {
          toast.success(data.message);
          if (formRef) {
            formRef.reset();
          }
        }
      } catch (error: any) {
        toast.error("Try again later");
      }
    }
  };

  const cleanErrors = (id: string) => {
    updateMangaFormErrors = { ...updateMangaFormErrors, [id]: "" };
  };
</script>

<Header />
<main class="flex justify-center items-center mt-4 px-4">
  {#if !isMangaFound}
    <Alert.Root class="w-3/5 text-center m-auto mt-5" variant="destructive">
      <Alert.Title>Manga not found</Alert.Title>
    </Alert.Root>
  {:else}
    <MangaForm
      bind:formRef
      {handleFormSubmit}
      bind:mangaForm={updateMangaForm}
      mangaFormErrors={updateMangaFormErrors}
      {cleanErrors}
      header="Update Manga"
      actionButtonText="Update manga"
    />
  {/if}
</main>
<Toaster
  theme="dark"
  toastOptions={{
    classes: {
      toast: "border-2 text-lg",
    },
  }}
/>
