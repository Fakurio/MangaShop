import type { ColumnDef } from "@tanstack/table-core";
import { createRawSnippet, type Snippet } from "svelte";
import { renderComponent, renderSnippet } from "$lib/components/ui/data-table";
import DataTableSortButton from "../../components/DataTable/DataTableSortButton.svelte";
import DataTableActions from "../../components/DataTable/DataTableActions.svelte";
import type { Manga } from "../../types/manga";

const LOW_STOCK_QUANTITY_THRESHOLD = 20;

export type AdminDashboardColumns = Pick<
  Manga,
  "img_url" | "title" | "price" | "stock_quantity" | "manga_id"
>;

export const adminColumns: ColumnDef<AdminDashboardColumns>[] = [
  {
    accessorKey: "img_url",
    header: "Image",
    cell: ({ row }) => {
      const imageSnippet = createRawSnippet(() => {
        return {
          render: () =>
            `<img src=${row.getValue("img_url")} class="h-[150px] max-w-[100px]" alt="manga logo"/>`,
        };
      });
      return renderSnippet(imageSnippet, null);
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    filterFn: "includesString",
  },
  {
    accessorKey: "price",
    header: ({ column }) =>
      renderComponent(DataTableSortButton, {
        onclick: () =>
          column.toggleSorting(column.getIsSorted() === "asc", true),
        children: "Price" as unknown as Snippet,
      }),
    cell: ({ row }) => {
      const priceSnippet = createRawSnippet(() => {
        return {
          render: () =>
            `<div class="text-center">${row.getValue("price")}</div>`,
        };
      });
      return renderSnippet(priceSnippet, null);
    },
  },
  {
    accessorKey: "stock_quantity",
    header: ({ column }) =>
      renderComponent(DataTableSortButton, {
        onclick: () =>
          column.toggleSorting(column.getIsSorted() === "asc", true),
        children: "Stock Quantity" as unknown as Snippet,
      }),
    cell: ({ row }) => {
      const stockSnippet = createRawSnippet(() => {
        return {
          render: () => `
                        <div class="text-center ${
                          row.getValue<number>("stock_quantity") <
                          LOW_STOCK_QUANTITY_THRESHOLD
                            ? "text-destructive font-bold"
                            : undefined
                        }">
                             ${row.getValue("stock_quantity")}
                        </div>`,
        };
      });
      return renderSnippet(stockSnippet, null);
    },
  },
  {
    accessorKey: "buttons",
    header: "",
    cell: ({ row }) => {
      return renderComponent(DataTableActions, {
        manga_id: row.original.manga_id,
      });
    },
  },
];
