<script lang="ts">
  import Header from "../../components/Header.svelte";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import {
    fetchMangaForAdmin,
    adminMangaStore,
    adminMangaStoreError,
  } from "../../stores/admin.store";
  import { adminColumns } from "./adminDashboardColumns";
  import DataTable from "../../components/DataTable/DataTable.svelte";
  import { Toaster } from "$lib/components/ui/sonner";
  import { toast } from "svelte-sonner";
  import { onMount } from "svelte";
  import { replace } from "svelte-spa-router";
  import { authStore } from "../../stores/auth.store";
  import { RoleEnum } from "../../enums/role-enum";

  $effect(() => {
    if ($adminMangaStoreError) {
      toast.error("Failed to fetch manga inventory");
    }
  });

  onMount(() => {
    const isAdminLoggedIn =
      $authStore !== null && $authStore.roles.includes(RoleEnum.ADMIN);
    if (!isAdminLoggedIn) {
      replace("/");
    }

    const handlePopState = (event) => {
      const hash = event.target.location.hash as string;
      if (isAdminLoggedIn && !hash.startsWith("#/admin")) {
        replace("/admin");
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  });
</script>

<Header />
<main class="px-20 py-6">
  {#await fetchMangaForAdmin()}
    <Skeleton class="h-96 w-full m-auto" />
  {:then _}
    <DataTable
      data={$adminMangaStore}
      columns={adminColumns}
      searchByColumn="title"
    />
  {/await}
  <Toaster
    theme="dark"
    toastOptions={{
      classes: {
        toast: "border-2 text-lg",
      },
    }}
  />
</main>

<style>
  @media (max-width: 600px) {
    main {
      padding-inline: 2rem;
    }
  }

  @media (max-width: 400px) {
    main {
      padding-inline: 1rem;
    }
  }
</style>
