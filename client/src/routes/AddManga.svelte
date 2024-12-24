<script lang="ts">
  import * as Alert from "$lib/components/ui/alert/index.js";
  import Header from "../components/Header.svelte";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { fetchGenres } from "../stores/manga.store";
  import * as Select from "$lib/components/ui/select/index.js";
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import {
    addMangaFormSchema,
    type AddMangaForm,
    type AddMangaFormErrors,
  } from "../types/add-manga-form";
  import { getErrorsFromZod } from "../utils/getErrorsFromZod";
  import Label from "$lib/components/ui/label/label.svelte";
  import { Toaster } from "$lib/components/ui/sonner";
  import { toast } from "svelte-sonner";
  import { addManga } from "../stores/admin.store";

  const addMangaForm = $state<AddMangaForm>({
    title: "",
    img_url: "",
    price: "",
    stock_quantity: null,
    author: "",
    description: "",
    genres: [],
  });

  let addMangaFormErrors = $state<AddMangaFormErrors>({
    title: "",
    img_url: "",
    price: "",
    stock_quantity: "",
    author: "",
    description: "",
    genres: "",
  });

  let formRef: HTMLFormElement;

  const handleFormSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const parsedForm = addMangaFormSchema.safeParse(addMangaForm);
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
          formRef.reset();
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
  <form
    bind:this={formRef}
    class="flex flex-col border-border border-2 rounded-3xl bg-card p-8 w-full max-w-[600px]"
    onsubmit={(e) => handleFormSubmit(e)}
  >
    <h1 class="text-center text-4xl font-bold">New Manga</h1>
    <Label class="mt-6" for="title">Title</Label>
    <Input
      id="title"
      class="mt-2"
      bind:value={addMangaForm.title}
      onclick={(e: MouseEvent) => {
        if (e.target) {
          cleanErrors((e.target as HTMLInputElement).id);
        }
      }}
      required
    />
    {#if addMangaFormErrors.title}
      <Alert.Root class="mt-5" variant="destructive">
        <Alert.Title>{addMangaFormErrors.title}</Alert.Title>
      </Alert.Root>
    {/if}

    <Label class="mt-6" for="img_url">Image URL</Label>
    <Input
      class="mt-2"
      id="img_url"
      bind:value={addMangaForm.img_url}
      onclick={(e: MouseEvent) => {
        if (e.target) {
          cleanErrors((e.target as HTMLInputElement).id);
        }
      }}
      required
    />
    {#if addMangaFormErrors.img_url}
      <Alert.Root class="mt-5" variant="destructive">
        <Alert.Title>{addMangaFormErrors.img_url}</Alert.Title>
      </Alert.Root>
    {/if}

    <Label class="mt-6" for="price">Price</Label>
    <Input
      class="mt-2"
      id="price"
      bind:value={addMangaForm.price}
      onclick={(e: MouseEvent) => {
        if (e.target) {
          cleanErrors((e.target as HTMLInputElement).id);
        }
      }}
      required
    />
    {#if addMangaFormErrors.price}
      <Alert.Root class="mt-5" variant="destructive">
        <Alert.Title>{addMangaFormErrors.price}</Alert.Title>
      </Alert.Root>
    {/if}

    <Label class="mt-6" for="stock_quantity">Stock quantity</Label>
    <Input
      type="number"
      class="mt-2"
      id="stock_quantity"
      bind:value={addMangaForm.stock_quantity}
      onclick={(e: MouseEvent) => {
        if (e.target) {
          cleanErrors((e.target as HTMLInputElement).id);
        }
      }}
      required
    />
    {#if addMangaFormErrors.stock_quantity}
      <Alert.Root class="mt-5" variant="destructive">
        <Alert.Title>{addMangaFormErrors.stock_quantity}</Alert.Title>
      </Alert.Root>
    {/if}

    <Label class="mt-6" for="author">Author</Label>
    <Input
      class="mt-2"
      id="author"
      bind:value={addMangaForm.author}
      onclick={(e: MouseEvent) => {
        if (e.target) {
          cleanErrors((e.target as HTMLInputElement).id);
        }
      }}
      required
    />
    {#if addMangaFormErrors.author}
      <Alert.Root class="mt-5" variant="destructive">
        <Alert.Title>{addMangaFormErrors.author}</Alert.Title>
      </Alert.Root>
    {/if}

    <Label class="mt-6" for="description">Description</Label>
    <Textarea
      id="description"
      bind:value={addMangaForm.description}
      class="mt-2"
      onclick={(e: MouseEvent) => {
        if (e.target) {
          cleanErrors((e.target as HTMLTextAreaElement).id);
        }
      }}
      required
    />
    {#if addMangaFormErrors.description}
      <Alert.Root class="mt-5" variant="destructive">
        <Alert.Title>{addMangaFormErrors.description}</Alert.Title>
      </Alert.Root>
    {/if}

    {#await fetchGenres()}
      <Skeleton class="w-full h-14 mt-6" />
    {:then genres}
      <Label class="mt-6" for="genres">Genres</Label>
      <Select.Root type="multiple" bind:value={addMangaForm.genres}>
        <Select.Trigger
          id="genres"
          class="w-full mt-2"
          onclick={(e: MouseEvent) => {
            if (e.target) {
              cleanErrors((e.target as HTMLButtonElement).id);
            }
          }}
        >
          {addMangaForm.genres.length > 0
            ? addMangaForm.genres
            : "Select genres"}
        </Select.Trigger>
        <Select.Content>
          {#each genres as genre}
            <Select.Item value={genre.name} label={genre.name}
              >{genre.name}</Select.Item
            >
          {/each}
        </Select.Content>
      </Select.Root>
      {#if addMangaFormErrors.genres}
        <Alert.Root class="mt-5" variant="destructive">
          <Alert.Title>{addMangaFormErrors.genres}</Alert.Title>
        </Alert.Root>
      {/if}
    {/await}

    <Button type="submit" class="mt-6">Add manga</Button>
  </form>
</main>
<Toaster
  theme="dark"
  toastOptions={{
    classes: {
      toast: "border-2 text-lg",
    },
  }}
/>
