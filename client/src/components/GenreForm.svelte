<script lang="ts">
    import Label from "../lib/components/ui/label/label.svelte";
    import {Input} from "$lib/components/ui/input/index.js";
    import {Button} from "$lib/components/ui/button/index.js";
    import type {GenreForm, GenreFormErrors} from "../types/genre-form.js";
    import * as Alert from "$lib/components/ui/alert/index.js";

    interface GenreFormProps {
        formRef: HTMLFormElement | undefined;
        handleFormSubmit: (e: SubmitEvent) => void;
        genreForm: GenreForm;
        genreFormErrors: GenreFormErrors;
        cleanErrors: (id: string) => void;
        header: string;
        actionButtonText: string;
    }

    let {
        formRef = $bindable(),
        handleFormSubmit,
        genreForm = $bindable(),
        cleanErrors,
        genreFormErrors,
        header,
        actionButtonText,
    }: GenreFormProps = $props();
</script>

<form
        bind:this={formRef}
        class="flex flex-col border-border border-2 rounded-3xl bg-card p-8 w-full max-w-[600px]"
        onsubmit={(e) => handleFormSubmit(e)}
>
    <h1 class="text-center text-4xl font-bold">{header}</h1>
    <Label class="mt-6" for="title">Name</Label>
    <Input
            id="name"
            class="mt-2"
            bind:value={genreForm.name}
            onclick={(e: MouseEvent) => {
      if (e.target) {
        cleanErrors((e.target as HTMLInputElement).id);
      }
    }}
            required
    />
    {#if genreFormErrors.name}
        <Alert.Root class="mt-5" variant="destructive">
            <Alert.Title>{genreFormErrors.name}</Alert.Title>
        </Alert.Root>
    {/if}

    <Button type="submit" class="mt-6">{actionButtonText}</Button>
</form>