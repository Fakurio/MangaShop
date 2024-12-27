<script lang="ts">
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { link } from "svelte-spa-router";
  import { adminMangaStoreError, deleteManga } from "../../stores/admin.store";
  import { toast } from "svelte-sonner";

  interface DataTableActionsProps {
    manga_id: string;
  }

  let { manga_id }: DataTableActionsProps = $props();

  let isOpen = $state<boolean>(false);

  const handleDeletion = async (e: SubmitEvent) => {
    e.preventDefault();
    await deleteManga(manga_id);
    isOpen = false;
    if (!$adminMangaStoreError) {
      toast.success("Manga deleted successfully");
    }
  };
</script>

<div class="flex justify-center gap-4 actions">
  <Button
    ><a href={`/admin/update-manga/${manga_id}`} use:link>Update</a></Button
  >
  <AlertDialog.Root bind:open={isOpen}>
    <AlertDialog.Trigger class={buttonVariants({ variant: "destructive" })}>
      Delete
    </AlertDialog.Trigger>
    <AlertDialog.Content interactOutsideBehavior="close">
      <AlertDialog.Title>Confirm operation</AlertDialog.Title>
      <AlertDialog.Description>
        Are you sure you want to delete this manga?
      </AlertDialog.Description>
      <form
        class="flex w-full items-center gap-2"
        onsubmit={(e) => handleDeletion(e)}
      >
        <AlertDialog.Cancel class="w-full" type="button">No</AlertDialog.Cancel>
        <AlertDialog.Action class="w-full" type="submit">Yes</AlertDialog.Action
        >
      </form>
    </AlertDialog.Content>
  </AlertDialog.Root>
</div>

<style>
  @media (max-width: 1000px) {
    .actions {
      flex-direction: column;
    }
  }
</style>
