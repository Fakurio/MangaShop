import type { ColumnDef } from "@tanstack/table-core";
import { renderComponent, renderSnippet } from "$lib/components/ui/data-table";
import DataTableActions from "../../components/DataTable/DataTableActions.svelte";
import type { Genre } from "src/types/genre";
import { deleteGenre } from "../../stores/admin.store";
import { createRawSnippet } from "svelte";

export const adminGenresColumns: ColumnDef<Genre>[] = [
  {
    accessorKey: "name",
    header: "Name",
    filterFn: "includesString",
    cell: ({ row }) => {
      const snippet = createRawSnippet(() => {
        return {
          render: () => {
            return `<p>${row.original.name}</p>`;
          },
        };
      });
      return renderSnippet(snippet, null);
    },
  },
  {
    accessorKey: "buttons",
    header: "",
    size: 50,
    cell: ({ row }) => {
      return renderComponent(DataTableActions, {
        entityId: row.original.genre_id.toString(),
        updatePath: "/admin/update-genre",
        onDelete: deleteGenre,
        dialogDescription: "Are you sure you want to delete this genre?",
        deleteSuccessMessage: "Genre deleted successfully",
      });
    },
  },
];
