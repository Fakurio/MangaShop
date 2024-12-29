import type { ColumnDef } from "@tanstack/table-core";
import { renderComponent } from "$lib/components/ui/data-table";
import DataTableActions from "../../components/DataTable/DataTableActions.svelte";
import type { Genre } from "src/types/genre";
import { deleteGenre } from "../../stores/admin.store";

export const adminGenresColumns: ColumnDef<Genre>[] = [
  {
    accessorKey: "name",
    header: "Name",
    filterFn: "includesString",
  },
  {
    accessorKey: "buttons",
    header: "",
    cell: ({ row }) => {
      return renderComponent(DataTableActions, {
        entityId: row.original.genre_id,
        onDelete: deleteGenre,
        dialogDescription: "Are you sure you want to delete this genre?",
        deleteSuccessMessage: "Genre deleted successfully",
      });
    },
  },
];
