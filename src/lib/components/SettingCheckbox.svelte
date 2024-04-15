<script lang="ts">
    import { onMount } from 'svelte';
    import * as Tooltip from '$lib/components/ui/tooltip';
    import { MaterialSymbolsHelpRounded } from '$lib/components/icons';
    import type { WxtStorageItem } from 'wxt/storage';
    import { Checkbox } from '$lib/components/ui/checkbox';
    import Label from '$lib/components/ui/label/label.svelte';

    export let text: string;
    export let storage: WxtStorageItem<boolean, {}>;
    export let dataTip: string;

    $: checked = false;

    const storeValue = async () => {
        checked = !checked;
        await storage.setValue(checked);
    };

    onMount(async () => {
        checked = await storage.getValue();
    });
</script>

<div class="w-full border border-base-300 bg-card/90 rounded-lg p-4 z-10">
    <div class="flex items-center justify-between gap-2 space-x-2">
        <div class="flex items-center gap-2">
            <Label for="terms" class="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{text}</Label>
            <Tooltip.Root>
                <Tooltip.Trigger>
                    <MaterialSymbolsHelpRounded class="size-4 text-neutral-300 hover:text-neutral-100" />
                </Tooltip.Trigger>
                <Tooltip.Content>
                    <p>{dataTip}</p>
                </Tooltip.Content>
            </Tooltip.Root>
        </div>
        <Checkbox id="terms" bind:checked on:click={storeValue} />
    </div>
</div>
