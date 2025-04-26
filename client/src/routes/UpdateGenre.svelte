<script lang="ts">
    import Header from "../components/Header.svelte";
    import { getErrorsFromZod } from "../utils/getErrorsFromZod";
    import * as Alert from "$lib/components/ui/alert/index.js";
    import { Toaster } from "$lib/components/ui/sonner";
    import { toast } from "svelte-sonner";
    import {findGenre, updateGenre} from "../stores/admin.store";
    import {type GenreForm as GenreFormT, type GenreFormErrors, genreFormSchema} from "../types/genre-form";
    import GenreForm from "../components/GenreForm.svelte";

    let { params }: { params: { id: string } } = $props();

    let updateGenreForm = $state<GenreFormT>({
       name: ""
    });

    let updateGenreFormErrors = $state<GenreFormErrors>({
        name: ""
    });

    let formRef = $state<HTMLFormElement>();
    let isGenreFound = $state<boolean>(true);

    $effect(() => {
        isGenreFound = true;
        const found = findGenre(params.id);
        if (found) {
            updateGenreForm = { ...found};
        } else {
            isGenreFound = false;
        }
    });

    const handleFormSubmit = async (e: SubmitEvent) => {
        e.preventDefault();
        const parsedForm = genreFormSchema.safeParse(updateGenreForm);
        const errors = getErrorsFromZod(parsedForm);
        if (errors) {
            updateGenreFormErrors = errors;
        } else {
            try {
                const [errors, data] = await updateGenre(params.id, updateGenreForm);
                if (errors) {
                    // Server errors
                    updateGenreFormErrors = errors.messages;
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
        updateGenreFormErrors = { ...updateGenreFormErrors, [id]: "" };
    };
</script>

<Header />
<main class="flex justify-center items-center mt-4 px-4">
    {#if !isGenreFound}
        <Alert.Root class="w-3/5 text-center m-auto mt-5" variant="destructive">
            <Alert.Title>Genre not found</Alert.Title>
        </Alert.Root>
    {:else}
        <GenreForm
                bind:formRef
                {handleFormSubmit}
                bind:genreForm={updateGenreForm}
                genreFormErrors={updateGenreFormErrors}
                {cleanErrors}
                header="Update Genre"
                actionButtonText="Update genre"
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