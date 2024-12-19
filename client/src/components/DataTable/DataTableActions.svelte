<script lang="ts">
    import {Button} from "$lib/components/ui/button/index.js";

    interface DataTableActionsProps {
        manga_id: number;
    }

    let { manga_id } : DataTableActionsProps = $props()
</script>

<div class="flex justify-center gap-4 actions">
    <Button onclick={() => console.log(manga_id)}>Update</Button>
    <Button variant="destructive" onclick={() => console.log(manga_id)}>Delete</Button>
</div>

<style>
    @media (max-width: 1000px) {
        .actions {
            flex-direction: column;
        }
    }
</style>