<script lang="ts">
  import Header from "../components/Header.svelte";
  import {
    mangaFormSchema,
    type MangaForm as MangaFormT,
    type MangaFormErrors,
  } from "../types/manga-form";
  import { getErrorsFromZod } from "../utils/getErrorsFromZod";
  import { Toaster } from "$lib/components/ui/sonner";
  import { toast } from "svelte-sonner";
  import { addManga } from "../stores/admin.store";
  import MangaForm from "../components/MangaForm.svelte";

  let addMangaForm = $state<MangaFormT>({
    title: "",
    img_url: "",
    price: "",
    stock_quantity: null,
    author: "",
    description: "",
    genres: [],
  });

  let addMangaFormErrors = $state<MangaFormErrors>({
    title: "",
    img_url: "",
    price: "",
    stock_quantity: "",
    author: "",
    description: "",
    genres: "",
  });

  let formRef = $state<HTMLFormElement>();

  const handleFormSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const parsedForm = mangaFormSchema.safeParse(addMangaForm);
    const errors = getErrorsFromZod(parsedForm);
    if (errors) {
      addMangaFormErrors = errors;
    } else {
      try {
        const [errors, data] = await addManga(addMangaForm);
        if (errors) {
          // Server errors
          addMangaFormErrors = errors.messages;
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
    addMangaFormErrors = { ...addMangaFormErrors, [id]: "" };
  };
</script>

<Header />
<main class="flex justify-center items-center mt-4 px-4">
  <MangaForm
    bind:formRef
    {handleFormSubmit}
    bind:mangaForm={addMangaForm}
    mangaFormErrors={addMangaFormErrors}
    {cleanErrors}
    header="New Manga"
    actionButtonText="Add manga"
  />
</main>
<Toaster
  theme="dark"
  toastOptions={{
    classes: {
      toast: "border-2 text-lg",
    },
  }}
/>
