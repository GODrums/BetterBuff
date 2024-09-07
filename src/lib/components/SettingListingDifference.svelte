<script lang="ts">
import * as Select from '$lib/components/ui/select';
import * as Tooltip from '$lib/components/ui/tooltip';
import { onMount } from 'svelte';
import { ExtensionStorage, type IStorage } from '../util/storage';
import MaterialSymbolsHelpRounded from './icons/MaterialSymbolsHelpRounded.svelte';
import { Input } from './ui/input';
import Label from './ui/label/label.svelte';

const differenceStorage = ExtensionStorage.listingDifferenceStyle;
const taxStorage = ExtensionStorage.platformTax;
const denominatorStorage = ExtensionStorage.listingDenominator;
const thresholdStorage = ExtensionStorage.profitThreshold;

const denominatorChoices = [
	{ value: 0, label: 'Steam' },
	{ value: 1, label: 'Buff Bid' },
];
$: denominator = denominatorChoices[0];

const differenceChoices = [
	{ value: 0, label: 'None' },
	{ value: 1, label: '¥ Difference' },
	{ value: 2, label: 'Converted Difference' },
	{ value: 3, label: '% Difference' },
	{ value: 4, label: 'Combined' },
];
$: differenceValue = differenceChoices[1];

const taxChoices = [
	{ value: 0, label: 'Off' },
	{ value: 1, label: 'On' },
	{ value: 2, label: 'Inverted' },
];
$: taxValue = taxChoices[0];

$: threshold = 0;

const storeValue = async (selected: any) => {
	differenceValue = selected;
	await differenceStorage.setValue(differenceValue.value as IStorage['listingDifferenceStyle']);
};

const storeSteamTax = async (selected: any) => {
	taxValue = selected;
	await taxStorage.setValue(taxValue.value as IStorage['platformTax']);
};

const storeDenominator = async (selected: any) => {
	denominator = selected;
	await denominatorStorage.setValue(denominator.value as IStorage['listingDenominator']);
};

const storeThreshold = async () => {
	await thresholdStorage.setValue(threshold as IStorage['profitThreshold']);
};

onMount(async () => {
	differenceValue = differenceChoices[await differenceStorage.getValue()];
	taxValue = taxChoices[await taxStorage.getValue()];
	denominator = denominatorChoices[await denominatorStorage.getValue()];
	threshold = await thresholdStorage.getValue();
});
</script>

<div class="w-full mx-4 border border-base-300 bg-card/90 rounded-lg py-2 px-3">
    <div class="flex items-center gap-2 mt-1 mx-1">
        <div class="flex items-center gap-2 mt-1 mx-1">
            <Label class="text-sm font-medium">Price Difference</Label>
            <Tooltip.Root>
                <Tooltip.Trigger>
                    <MaterialSymbolsHelpRounded class="size-5 text-neutral-300 hover:text-neutral-100" />
                </Tooltip.Trigger>
                <Tooltip.Content>
                    <p>Display listing price difference between the Buff listing prices and another platform</p>
                </Tooltip.Content>
            </Tooltip.Root>
        </div>
    </div>
    <ul class="mx-2 gap-2">
        <div class="flex justify-between mx-2 my-2">
            <div class="flex items-center gap-2">
                <Label class="text-sm font-normal">Denominator</Label>
                <Tooltip.Root>
                    <Tooltip.Trigger>
                        <MaterialSymbolsHelpRounded class="size-4 text-neutral-300 hover:text-neutral-100" />
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        <p>Platform to use as denominator of the formula for the market page. Sell order pages always use Steam prices.</p>
                    </Tooltip.Content>
                </Tooltip.Root>
            </div>
            <Select.Root bind:selected={denominator} items={denominatorChoices} onSelectedChange={storeDenominator}>
                <Select.Trigger class="w-fit">
                    <Select.Value class="text-white mr-2" />
                </Select.Trigger>
                <Select.Content>
                    {#each denominatorChoices as choice}
                        <Select.Item value={choice.value}>{choice.label}</Select.Item>
                    {/each}
                </Select.Content>
            </Select.Root>
        </div>
        <div class="flex items-center justify-between mx-2 my-2">
            <Label class="text-sm font-normal">Format</Label>
            <Select.Root bind:selected={differenceValue} items={differenceChoices} onSelectedChange={storeValue}>
                <Select.Trigger class="w-fit">
                    <Select.Value class="text-white mr-2" />
                </Select.Trigger>
                <Select.Content>
                    {#each differenceChoices as choice}
                        <Select.Item value={choice.value}>{choice.label}</Select.Item>
                    {/each}
                </Select.Content>
            </Select.Root>
        </div>
        <div class="flex justify-between mx-2 my-2">
            <div class="flex items-center gap-2">
                <Label class="text-sm font-normal">Apply Tax</Label>
                <Tooltip.Root>
                    <Tooltip.Trigger>
                        <MaterialSymbolsHelpRounded class="size-4 text-neutral-300 hover:text-neutral-100" />
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        <p>Apply platform tax before calculating the difference. The result is equivalent to the seller's income at the given price point</p>
                    </Tooltip.Content>
                </Tooltip.Root>
            </div>
            <Select.Root bind:selected={taxValue} items={taxChoices} onSelectedChange={storeSteamTax}>
                <Select.Trigger class="w-fit">
                    <Select.Value class="text-white mr-2" />
                </Select.Trigger>
                <Select.Content>
                    {#each taxChoices as choice}
                        <Select.Item value={choice.value}>{choice.label}</Select.Item>
                    {/each}
                </Select.Content>
            </Select.Root>
        </div>
        <div class="flex justify-between mx-2 my-2">
            <div class="flex items-center gap-2">
                <Label class="text-sm font-normal">Profit Threshold</Label>
                <Tooltip.Root>
                    <Tooltip.Trigger>
                        <MaterialSymbolsHelpRounded class="size-4 text-neutral-300 hover:text-neutral-100" />
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        <p>Threshold value in percent to still be colored in green</p>
                    </Tooltip.Content>
                </Tooltip.Root>
            </div>
            <div class="input-euro">
                <Input type="number" class="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" min="0" max="99" step="1" bind:value={threshold} on:change={storeThreshold} />
            </div>
        </div>
    </ul>
</div>

<style>
    .input-euro {
        position: relative;
    }

    .input-euro:before {
        position: absolute;
        top: 9px;
        content: '%';
        right: 10px;
    }
</style>
