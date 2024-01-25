<script lang="ts">
    import { onMount } from 'svelte';
    import Tooltip from './Tooltip.svelte';
    import { ExtensionStorage, type IStorage } from '../util/storage';

    let differenceStorage = ExtensionStorage.listingDifferenceStyle;
    let taxStorage = ExtensionStorage.platformTax;
    let denominatorStorage = ExtensionStorage.listingDenominator;
    let thresholdStorage = ExtensionStorage.profitThreshold;

    $: taxValue = 1;
    $: checked = false;
    $: denominator = 0;
    $: threshold = 0;

    const storeValue = async () => {
        await differenceStorage.setValue(taxValue as IStorage['listingDifferenceStyle']);
    };

    const storeSteamTax = async () => {
        checked = !checked;
        await taxStorage.setValue(checked);
    };

    const storeDenominator = async () => {
        await denominatorStorage.setValue(denominator as IStorage['listingDenominator']);
    };

    const storeThreshold = async () => {
        await thresholdStorage.setValue(threshold as IStorage['profitThreshold']);
    };

    onMount(async () => {
        taxValue = await differenceStorage.getValue();
        checked = await taxStorage.getValue();
        denominator = await denominatorStorage.getValue();
        threshold = await thresholdStorage.getValue();
    });
</script>

<div class="form-control w-full mx-4 border border-base-300 bg-[#09090b]/90 rounded-lg py-2 px-3">
    <div class="inline-flex gap-2 mt-1">
        <span class="label-text text-primary">Price Difference</span>
        <Tooltip dataTip="Display listing price difference between the Buff listing prices and another platform." tooltipClass="tooltip-primary" svgClass="text-info hover:text-base-100" />
    </div>
    <label class="label items-center justify-between cursor-pointer mx-2">
        <div class="inline-flex gap-2">
            <span class="label-text text-primary">Denominator</span>
            <Tooltip dataTip="Platform to use as denominator of the formula. Either the lowest listed on the steam market or Buff buy order" tooltipClass="tooltip-primary" svgClass="text-info hover:text-base-100" />
        </div>
        <select class="select select-sm w-1/2" bind:value={denominator} on:click={storeDenominator} >
          <option value=0>Steam</option>
          <option value=1>Buff Bid</option>
        </select>
    </label>
    <label class="label items-center justify-between cursor-pointer mx-2">
        <div class="inline-flex gap-2">
            <span class="label-text text-primary">Format</span>
        </div>
        <select class="select select-sm w-1/2" bind:value={taxValue} on:click={storeValue} >
          <option value=0>None</option>
          <option value=1 selected>¥ Difference</option>
          <option value=2>Converted Difference</option>
          <option value=3>% Difference</option>
          <option value=4>Combined</option>
        </select>
    </label>
    <label class="label items-center justify-between cursor-pointer mx-2">
        <div class="inline-flex gap-2">
            <span class="label-text text-primary">Apply Platform Tax</span>
            <Tooltip dataTip="Apply platform tax before calculating the difference. The result is equivalent to the seller's income at the given price point." tooltipClass="tooltip-primary" svgClass="text-info hover:text-base-100" />
        </div>
        <input type="checkbox" class="toggle toggle-info" bind:checked={checked} on:click={storeSteamTax} />
    </label>
    <label class="label items-center justify-between cursor-pointer mx-2">
        <div class="inline-flex gap-2">
            <span class="label-text text-primary">Profit Threshold</span>
            <Tooltip dataTip="Threshold value in percent to still be colored in green." tooltipClass="tooltip-primary" svgClass="text-info hover:text-base-100" />
        </div>
        <input type="number" class="input input-sm w-14 pr-0 focus:outline-none" min="0" max="99" step="1" bind:value={threshold} on:change={storeThreshold} />
    </label>
</div>
