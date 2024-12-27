<script lang="ts">
  import * as Alert from "$lib/components/ui/alert/index.js";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { fetchGenres } from "../stores/manga.store";
  import * as Select from "$lib/components/ui/select/index.js";
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import { type MangaForm, type MangaFormErrors } from "../types/manga-form";
  import Label from "$lib/components/ui/label/label.svelte";

  interface MangaFormProps {
    formRef: HTMLFormElement | undefined;
    handleFormSubmit: (e: SubmitEvent) => void;
    mangaForm: MangaForm;
    mangaFormErrors: MangaFormErrors;
    cleanErrors: (id: string) => void;
    header: string;
    actionButtonText: string;
  }

  let {
    formRef = $bindable(),
    handleFormSubmit,
    mangaForm = $bindable(),
    cleanErrors,
    mangaFormErrors,
    header,
    actionButtonText,
  }: MangaFormProps = $props();
</script>

<form
  bind:this={formRef}
  class="flex flex-col border-border border-2 rounded-3xl bg-card p-8 w-full max-w-[600px]"
  onsubmit={(e) => handleFormSubmit(e)}
>
  <h1 class="text-center text-4xl font-bold">{header}</h1>
  <Label class="mt-6" for="title">Title</Label>
  <Input
    id="title"
    class="mt-2"
    bind:value={mangaForm.title}
    onclick={(e: MouseEvent) => {
      if (e.target) {
        cleanErrors((e.target as HTMLInputElement).id);
      }
    }}
    required
  />
  {#if mangaFormErrors.title}
    <Alert.Root class="mt-5" variant="destructive">
      <Alert.Title>{mangaFormErrors.title}</Alert.Title>
    </Alert.Root>
  {/if}

  <Label class="mt-6" for="img_url">Image URL</Label>
  <Input
    class="mt-2"
    id="img_url"
    bind:value={mangaForm.img_url}
    onclick={(e: MouseEvent) => {
      if (e.target) {
        cleanErrors((e.target as HTMLInputElement).id);
      }
    }}
    required
  />
  {#if mangaFormErrors.img_url}
    <Alert.Root class="mt-5" variant="destructive">
      <Alert.Title>{mangaFormErrors.img_url}</Alert.Title>
    </Alert.Root>
  {/if}

  <Label class="mt-6" for="price">Price</Label>
  <Input
    class="mt-2"
    id="price"
    bind:value={mangaForm.price}
    onclick={(e: MouseEvent) => {
      if (e.target) {
        cleanErrors((e.target as HTMLInputElement).id);
      }
    }}
    required
  />
  {#if mangaFormErrors.price}
    <Alert.Root class="mt-5" variant="destructive">
      <Alert.Title>{mangaFormErrors.price}</Alert.Title>
    </Alert.Root>
  {/if}

  <Label class="mt-6" for="stock_quantity">Stock quantity</Label>
  <Input
    type="number"
    class="mt-2"
    id="stock_quantity"
    bind:value={mangaForm.stock_quantity}
    onclick={(e: MouseEvent) => {
      if (e.target) {
        cleanErrors((e.target as HTMLInputElement).id);
      }
    }}
    required
  />
  {#if mangaFormErrors.stock_quantity}
    <Alert.Root class="mt-5" variant="destructive">
      <Alert.Title>{mangaFormErrors.stock_quantity}</Alert.Title>
    </Alert.Root>
  {/if}

  <Label class="mt-6" for="author">Author</Label>
  <Input
    class="mt-2"
    id="author"
    bind:value={mangaForm.author}
    onclick={(e: MouseEvent) => {
      if (e.target) {
        cleanErrors((e.target as HTMLInputElement).id);
      }
    }}
    required
  />
  {#if mangaFormErrors.author}
    <Alert.Root class="mt-5" variant="destructive">
      <Alert.Title>{mangaFormErrors.author}</Alert.Title>
    </Alert.Root>
  {/if}

  <Label class="mt-6" for="description">Description</Label>
  <Textarea
    id="description"
    bind:value={mangaForm.description}
    class="mt-2"
    onclick={(e: MouseEvent) => {
      if (e.target) {
        cleanErrors((e.target as HTMLTextAreaElement).id);
      }
    }}
    required
  />
  {#if mangaFormErrors.description}
    <Alert.Root class="mt-5" variant="destructive">
      <Alert.Title>{mangaFormErrors.description}</Alert.Title>
    </Alert.Root>
  {/if}

  {#await fetchGenres()}
    <Skeleton class="w-full h-14 mt-6" />
  {:then genres}
    <Label class="mt-6" for="genres">Genres</Label>
    <Select.Root type="multiple" bind:value={mangaForm.genres}>
      <Select.Trigger
        id="genres"
        class="w-full mt-2"
        onclick={(e: MouseEvent) => {
          if (e.target) {
            cleanErrors((e.target as HTMLButtonElement).id);
          }
        }}
      >
        {mangaForm.genres.length > 0 ? mangaForm.genres : "Select genres"}
      </Select.Trigger>
      <Select.Content>
        {#each genres as genre}
          <Select.Item value={genre.name} label={genre.name}
            >{genre.name}</Select.Item
          >
        {/each}
      </Select.Content>
    </Select.Root>
    {#if mangaFormErrors.genres}
      <Alert.Root class="mt-5" variant="destructive">
        <Alert.Title>{mangaFormErrors.genres}</Alert.Title>
      </Alert.Root>
    {/if}
  {/await}

  <Button type="submit" class="mt-6">{actionButtonText}</Button>
</form>
