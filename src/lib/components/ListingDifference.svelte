<script lang="ts">
    import { onMount } from 'svelte';
    import type { WxtStorageItem } from 'wxt/storage';
    import Tooltip from './Tooltip.svelte';
    import { ExtensionStorage, type IStorage } from '../util/storage';

    let differenceStorage = ExtensionStorage.listingDifferenceStyle;
    let steamTaxStorage = ExtensionStorage.steamTax;

    $: value = 1;
    $: checked = false;

    const storeValue = async () => {
        await differenceStorage.setValue(value as IStorage['listingDifferenceStyle']);
    };

    const storeSteamTax = async () => {
        checked = !checked;
        await steamTaxStorage.setValue(checked);
    };

    onMount(async () => {
        value = await differenceStorage.getValue();
        checked = await steamTaxStorage.getValue();
    });
</script>

<div class="form-control w-full mx-4 border border-base-300 bg-[#09090b]/90 rounded-lg py-2 px-3">
    <div class="inline-flex gap-2 mt-1">
        <span class="label-text text-primary">Price Difference</span>
        <Tooltip dataTip="Display listing price difference between the Steam and Buff prices." tooltipClass="tooltip-primary" svgClass="text-info hover:text-base-100" />
    </div>
    <label class="label items-center justify-between cursor-pointer mx-2">
        <div class="inline-flex gap-2">
            <span class="label-text text-primary">Format</span>
        </div>
        <select class="select select-sm w-1/2" bind:value={value} on:click={storeValue} >
          <option value=0>None</option>
          <option value=1 selected>¥ Difference</option>
          <option value=2>Converted Difference</option>
          <option value=3>% Difference</option>
        </select>
    </label>
    <label class="label items-center justify-between cursor-pointer mx-2">
        <div class="inline-flex gap-2">
            <span class="label-text text-primary">Apply Steam Tax</span>
            <Tooltip dataTip="Apply Steam tax before calculating the difference. The result is equivalent to the seller's income at the given price point." tooltipClass="tooltip-primary" svgClass="text-info hover:text-base-100" />
        </div>
        <input type="checkbox" class="toggle toggle-info" bind:checked={checked} on:click={storeSteamTax} />
    </label>
</div>
