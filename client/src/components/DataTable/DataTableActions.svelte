<script lang="ts">
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { link } from "svelte-spa-router";
  import { adminMangaStoreError, deleteManga } from "../../stores/admin.store";
  import { toast } from "svelte-sonner";
  import type { Writable } from "svelte/store";

  interface DataTableActionsProps {
    entityId: string;
    updatePath?: string;
    onDelete: (id: string) => Promise<void>;
    dialogDescription: string;
    storeError?: Writable<any>;
    deleteSuccessMessage: string;
  }

  let {
    entityId,
    updatePath,
    onDelete,
    dialogDescription,
    storeError,
    deleteSuccessMessage,
  }: DataTableActionsProps = $props();

  let isOpen = $state<boolean>(false);

  const handleDeletion = async (e: SubmitEvent) => {
    e.preventDefault();
    await onDelete(entityId);
    isOpen = false;
    if (!$storeError) {
      toast.success(deleteSuccessMessage);
    }
  };
</script>

<div class="flex justify-end gap-4 actions">
  {#if updatePath}
    <Button><a href={`${updatePath}/${entityId}`} use:link>Update</a></Button>
  {/if}
  <AlertDialog.Root bind:open={isOpen}>
    <AlertDialog.Trigger class={buttonVariants({ variant: "destructive" })}>
      Delete
    </AlertDialog.Trigger>
    <AlertDialog.Content interactOutsideBehavior="close">
      <AlertDialog.Title>Confirm operation</AlertDialog.Title>
      <AlertDialog.Description>
        {dialogDescription}
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
