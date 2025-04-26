<script lang="ts">
import {Toaster} from "$lib/components/ui/sonner";
import Header from "../components/Header.svelte";
import {getErrorsFromZod} from "../utils/getErrorsFromZod";
import {addGenre} from "../stores/admin.store";
import {toast} from "svelte-sonner";
import {
    genreFormSchema,
    type GenreForm as GenreFormT,
    type GenreFormErrors} from "../types/genre-form";
import GenreForm from "../components/GenreForm.svelte";


let addGenreForm = $state<GenreFormT>({
   name: ""
});

let addGenreFormErrors = $state<GenreFormErrors>({
    name: ""
});

let formRef = $state<HTMLFormElement>();

const handleFormSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const parsedForm = genreFormSchema.safeParse(addGenreForm);
    const errors = getErrorsFromZod(parsedForm);
    if (errors) {
        addGenreFormErrors = errors;
    } else {
        try {
            const [errors, data] = await addGenre(addGenreForm);
            if (errors) {
                // Server errors
                addGenreFormErrors = errors.messages;
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
    addGenreFormErrors = { ...addGenreFormErrors, [id]: "" };
};
</script>

<Header />
<main class="flex justify-center items-center mt-4 px-4">
    <GenreForm
            bind:formRef
            {handleFormSubmit}
            bind:genreForm={addGenreForm}
            genreFormErrors={addGenreFormErrors}
            {cleanErrors}
            header="New Genre"
            actionButtonText="Add genre"
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