<script lang="ts">
    import { onMount } from 'svelte';
    import type { WxtStorageItem } from 'wxt/storage';
    import Tooltip from './Tooltip.svelte';

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

<div class="form-control w-full mx-4 border border-base-300 bg-[#09090b]/90 rounded-lg py-1 px-3">
    <label class="label items-center justify-between cursor-pointer">
        <div class="inline-flex gap-2">
            <span class="label-text text-primary">{text}</span>
            <Tooltip {dataTip} tooltipClass="tooltip-info" svgClass="text-info hover:text-base-100" />
        </div>
        <input type="checkbox" class="toggle toggle-info" {checked} on:click={storeValue} />
    </label>
</div>
