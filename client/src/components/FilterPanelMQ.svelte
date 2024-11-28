<script lang="ts">
    import MediaQuery from "./MediaQuery.svelte";
    import * as Dialog from "$lib/components/ui/dialog";
    import FilterPanel from "./FilterPanel.svelte";
    import {buttonVariants} from "$lib/components/ui/button/index.js";
    import type {PriceRange} from "../types/price-range";
    import {get} from "svelte/store";
    import {fetchMangaDetails, filteredGenres, filteredPriceRange, mangaStore} from "../stores/manga.store";


    let selectedGenres = $state<string[]>([])
    let selectedPriceRange = $state<PriceRange>({from: 0, to: 200})
    let isDialogOpen = $state<boolean>(false)

    const applyFilters = async () => {
        for (let manga of get(mangaStore)) {
            await fetchMangaDetails(manga.manga_id);
        }
        filteredGenres.set(selectedGenres);
        if (!selectedPriceRange.from) {
            selectedPriceRange.from = 0;
        }
        if (!selectedPriceRange.to) {
            selectedPriceRange.to = 200;
        }
        filteredPriceRange.set(selectedPriceRange);
    };

    const addGenre = (genre: string) => {
        selectedGenres.push(genre);
        console.log(selectedGenres);
    }

    const removeGenre = (genre: string) => {
        selectedGenres = selectedGenres.filter(item => item !== genre);
        console.log(selectedGenres);
    }

    const toggleDialog = () => {
        isDialogOpen = !isDialogOpen;
    }
</script>

<MediaQuery query="(max-width: 800px)" let:matches bind:selectedPriceRange>
    {#if matches}
        <Dialog.Root bind:open={isDialogOpen}>
            <Dialog.Trigger class={buttonVariants({variant: "default"})}>Open Filters</Dialog.Trigger>
            <Dialog.Content>
                <FilterPanel {selectedGenres} {addGenre}
                             {removeGenre} {applyFilters}
                             bind:selectedPriceRange
                             {toggleDialog}
                             />
            </Dialog.Content>
        </Dialog.Root>
    {/if}
</MediaQuery>
<MediaQuery query="(min-width: 801px)" let:matches bind:selectedPriceRange>
    {#if matches}
        <FilterPanel {selectedGenres} {addGenre}
                     {removeGenre} {applyFilters}
                     bind:selectedPriceRange
                     />
    {/if}
</MediaQuery>