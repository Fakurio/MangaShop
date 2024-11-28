<script lang="ts">
    import { onMount } from "svelte";

    export let query
    export let selectedPriceRange

    let mql: MediaQueryList;
    let mqlListener;
    let wasMounted = false;
    let matches = false;

    onMount(() => {
        wasMounted = true;
        return () => {
            removeActiveListener();
        };
    });

    $: {
        if (wasMounted) {
            removeActiveListener();
            addNewListener(query);
        }
    }

    const onChangeListener = (e: MediaQueryListEvent) => {matches = e.matches}

    function addNewListener(query: string) {
        mql = window.matchMedia(query);
        mql.addEventListener("change", onChangeListener);
        matches = mql.matches;
    }

    function removeActiveListener() {
        if (mql && mqlListener) {
            mql.removeEventListener("change", onChangeListener);
        }
    }
</script>

<slot {matches} {selectedPriceRange}/>