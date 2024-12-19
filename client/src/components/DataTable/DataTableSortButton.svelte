<script lang="ts">
    import type { ComponentProps } from "svelte";
    import ArrowUpDown from "lucide-svelte/icons/arrow-up-down";
    import { Button } from "$lib/components/ui/button";

    let { children, ...restProps }: ComponentProps<typeof Button> = $props();
</script>

<div class="text-center">
    <Button variant="ghost" {...restProps} class="mx-auto">
        {children}
        <ArrowUpDown class="size-4" />
    </Button>
</div>
