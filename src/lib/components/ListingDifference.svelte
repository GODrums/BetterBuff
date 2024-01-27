<script lang="ts">
    import { onMount } from 'svelte';
    import Tooltip from './Tooltip.svelte';
    import { ExtensionStorage, type IStorage } from '../util/storage';

    let differenceStorage = ExtensionStorage.listingDifferenceStyle;
    let taxStorage = ExtensionStorage.platformTax;
    let denominatorStorage = ExtensionStorage.listingDenominator;
    let thresholdStorage = ExtensionStorage.profitThreshold;

    $: differenceValue = 1;
    $: taxValue = 0;
    $: denominator = 0;
    $: threshold = 0;

    const storeValue = async () => {
        await differenceStorage.setValue(differenceValue as IStorage['listingDifferenceStyle']);
    };

    const storeSteamTax = async () => {
        await taxStorage.setValue(taxValue as IStorage['platformTax']);
    };

    const storeDenominator = async () => {
        await denominatorStorage.setValue(denominator as IStorage['listingDenominator']);
    };

    const storeThreshold = async () => {
        await thresholdStorage.setValue(threshold as IStorage['profitThreshold']);
    };

    onMount(async () => {
        differenceValue = await differenceStorage.getValue();
        taxValue = await taxStorage.getValue();
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
            <Tooltip
                dataTip="Platform to use as denominator of the formula. Either the lowest listed on the steam market or Buff buy order"
                tooltipClass="tooltip-primary"
                svgClass="text-info hover:text-base-100" />
        </div>
        <select class="select select-sm w-2/5" bind:value={denominator} on:click={storeDenominator}>
            <option value="0">Steam</option>
            <option value="1">Buff Bid</option>
        </select>
    </label>
    <label class="label items-center justify-between cursor-pointer mx-2">
        <div class="inline-flex gap-2">
            <span class="label-text text-primary">Format</span>
        </div>
        <select class="select select-sm w-1/2" bind:value={differenceValue} on:click={storeValue}>
            <option value="0">None</option>
            <option value="1" selected>¥ Difference</option>
            <option value="2">Converted Difference</option>
            <option value="3">% Difference</option>
            <option value="4">Combined</option>
        </select>
    </label>
    <label class="label items-center justify-between cursor-pointer mx-2">
        <div class="inline-flex gap-2">
            <span class="label-text text-primary">Apply Tax</span>
            <Tooltip
                dataTip="Apply platform tax before calculating the difference. The result is equivalent to the seller's income at the given price point."
                tooltipClass="tooltip-primary"
                svgClass="text-info hover:text-base-100" />
        </div>
        <select class="select select-sm w-2/5" bind:value={taxValue} on:click={storeSteamTax}>
            <option value="0">Off</option>
            <option value="1">On</option>
            <option value="2">Inverted</option>
        </select>
    </label>
    <label class="label items-center justify-between cursor-pointer mx-2">
        <div class="inline-flex gap-2">
            <span class="label-text text-primary">Profit Threshold</span>
            <Tooltip dataTip="Threshold value in percent to still be colored in green." tooltipClass="tooltip-primary" svgClass="text-info hover:text-base-100" />
        </div>
        <span class="label-text input-euro">
            <input type="number" class="input input-sm w-20 pr-4 focus:outline-none" min="0" max="99" step="1" bind:value={threshold} on:change={storeThreshold} />
        </span>
    </label>
</div>

<style>
    .input-euro {
        position: relative;
    }

    .input-euro:before {
        position: absolute;
        top: 5px;
        content: '%';
        right: 5px;
    }
</style>
