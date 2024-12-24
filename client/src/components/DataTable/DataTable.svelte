<script lang="ts" generics="TData, TValue">
  import {
    createSvelteTable,
    FlexRender,
  } from "$lib/components/ui/data-table/index.js";
  import * as Table from "$lib/components/ui/table/index";
  import {
    type ColumnDef,
    type ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type PaginationState,
    type SortingState,
  } from "@tanstack/table-core";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";
  import { link } from "svelte-spa-router";

  type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchByColumn: string;
  };

  let { data, columns, searchByColumn }: DataTableProps<TData, TValue> =
    $props();

  let columnFilters = $state<ColumnFiltersState>([]);
  let columnSorting = $state<SortingState>([
    { id: "stock_quantity", desc: false },
  ]);
  let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const table = createSvelteTable({
    get data() {
      return data;
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      get columnFilters() {
        return columnFilters;
      },
      get sorting() {
        return columnSorting;
      },
      get pagination() {
        return pagination;
      },
    },
    onColumnFiltersChange: (updater) => {
      if (typeof updater === "function") {
        columnFilters = updater(columnFilters);
      } else {
        columnFilters = updater;
      }
    },
    onSortingChange: (updater) => {
      if (typeof updater === "function") {
        columnSorting = updater(columnSorting);
      } else {
        columnSorting = updater;
      }
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        pagination = updater(pagination);
      } else {
        pagination = updater;
      }
    },
  });
</script>

<div class="flex justify-between">
  <Input
    placeholder={`Search by ${searchByColumn}...`}
    class="max-w-[200px]  lg:max-w-sm"
    value={table.getColumn(searchByColumn)?.getFilterValue()}
    oninput={(e) => {
      table.getColumn(searchByColumn)?.setFilterValue(e.currentTarget.value);
    }}
  />
  <Button><a href="/admin/add-manga" use:link>Add new</a></Button>
</div>
<div class="border-border border-2 rounded-md mt-4">
  <Table.Root>
    <Table.Header>
      {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
        <Table.Row>
          {#each headerGroup.headers as header (header.id)}
            <Table.Head>
              <FlexRender
                content={header.column.columnDef.header}
                context={header.getContext()}
              />
            </Table.Head>
          {/each}
        </Table.Row>
      {/each}
    </Table.Header>
    <Table.Body>
      {#each table.getRowModel().rows as row (row.id)}
        <Table.Row>
          {#each row.getVisibleCells() as cell (cell.id)}
            <Table.Cell>
              <FlexRender
                content={cell.column.columnDef.cell}
                context={cell.getContext()}
              />
            </Table.Cell>
          {/each}
        </Table.Row>
      {:else}
        <Table.Row>
          <Table.Cell colspan={columns.length} class="h-24 text-center">
            No results.
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
<div class="flex items-center justify-end space-x-2 py-4">
  <Button
    variant="outline"
    onclick={() => table.previousPage()}
    disabled={!table.getCanPreviousPage()}
  >
    Previous
  </Button>
  <Button
    variant="outline"
    onclick={() => table.nextPage()}
    disabled={!table.getCanNextPage()}
  >
    Next
  </Button>
</div>
