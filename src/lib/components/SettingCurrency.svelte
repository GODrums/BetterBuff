<script lang="ts">
import * as Select from '$lib/components/ui/select';
import * as Tooltip from '$lib/components/ui/tooltip';
import { convertCNY, getAvailableCurrencies, getSelectedCurrency, initializeStaticRates, loadCurrencySettings } from '$lib/util/currencyHelper';
import { ExtensionStorage } from '../util/storage';
import { MaterialSymbolsHelpRounded } from './icons';
import Checkbox from './ui/checkbox/checkbox.svelte';
import { Input } from './ui/input';
import Label from './ui/label/label.svelte';

initializeStaticRates();
const currencies = getAvailableCurrencies();
const currencyChoices = currencies.map((c) => ({ value: c.code, label: c.label }));

let selectedValue = $state(currencyChoices.find((c) => c.value === getSelectedCurrency()) ?? currencyChoices[0]);
let customRate = $state(1);
let customName = $state('CC');
let isCustom = $derived(selectedValue?.value === '---');
let ratePreview = $state<string | null>(null);
let conversionEnabled = $state(false);
let searchQuery = $state('');
let filteredChoices = $derived(
	searchQuery.length === 0 ? currencyChoices : currencyChoices.filter((c) => c.label.toLowerCase().includes(searchQuery.toLowerCase()) || c.value.toLowerCase().includes(searchQuery.toLowerCase()))
);

$effect(() => {
	ExtensionStorage.selectedCurrency.getValue().then((v) => {
		selectedValue = currencyChoices.find((c) => c.value === v) ?? currencyChoices[0];
	});
	ExtensionStorage.customCurrencyRate.getValue().then((v) => (customRate = v));
	ExtensionStorage.customCurrencyName.getValue().then((v) => (customName = v));
	ExtensionStorage.currencyConversionEnabled.getValue().then((v) => (conversionEnabled = v));
	loadCurrencySettings().then(() => updateRatePreview());
});

const updateRatePreview = () => {
	const code = selectedValue?.value;
	if (!code || code === 'CNY') {
		ratePreview = null;
		return;
	}
	const result = convertCNY(1);
	ratePreview = `1 CNY = ${result.symbol} ${result.value}`;
};

const storeCurrency = async (selected: any) => {
	selectedValue = selected;
	await ExtensionStorage.selectedCurrency.setValue(selected.value);
	await loadCurrencySettings();
	updateRatePreview();
};

const storeCustomRate = async () => {
	await ExtensionStorage.customCurrencyRate.setValue(customRate);
	await loadCurrencySettings();
	updateRatePreview();
};

const storeCustomName = async () => {
	await ExtensionStorage.customCurrencyName.setValue(customName);
	await loadCurrencySettings();
};

const toggleConversion = async () => {
	conversionEnabled = !conversionEnabled;
	await ExtensionStorage.currencyConversionEnabled.setValue(conversionEnabled);
};
</script>

<div class="w-full mx-4 border border-base-300 bg-card/90 rounded-lg py-2 px-3">
	<div class="flex items-center gap-2 mt-1 mx-1">
		<div class="flex items-center gap-2 mt-1 mx-1">
			<Label class="text-sm font-medium">Currency</Label>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<MaterialSymbolsHelpRounded class="size-5 text-neutral-300 hover:text-neutral-100" />
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Select your preferred display currency for price conversions. Rates are updated weekly.</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
	</div>
	<ul class="mx-2 gap-2">
		<div class="flex items-center justify-between mx-2 my-2">
			<Label class="text-sm font-normal">Enable Conversion</Label>
			<Checkbox checked={conversionEnabled} on:click={toggleConversion} />
		</div>
		{#if conversionEnabled}
		<div class="flex flex-col items-center gap-1 mx-2 my-1 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-2">
			<p class="text-xs text-yellow-200/80 text-center">
				Ensure your Buff163 display currency is set to RMB to avoid conflicts.
			</p>
			<a href="https://buff.163.com/user-center/profile" target="_blank" class="text-yellow-500 underline hover:text-yellow-400">Account Settings</a>
			
		</div>
		<div class="flex items-center justify-between mx-2 my-2">
			<Label class="text-sm font-normal">Display Currency</Label>
			<Select.Root bind:selected={selectedValue} items={currencyChoices} onSelectedChange={storeCurrency} onOpenChange={(open) => { if (!open) searchQuery = ''; }}>
				<Select.Trigger class="w-fit max-w-[180px]">
					<Select.Value class="text-white mr-2" />
				</Select.Trigger>
				<Select.Content class="min-w-[240px] max-h-[300px] overflow-y-auto">
					<div class="px-2 py-1.5 sticky top-0 bg-primary z-10">
						<input
							type="text"
							class="w-full rounded-sm border border-muted-foreground/30 bg-transparent px-2 py-1 text-xs text-white outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
							placeholder="Search..."
							name="search"
							bind:value={searchQuery}
							onclick={(e) => e.stopPropagation()}
							onkeydown={(e) => e.stopPropagation()}
						/>
					</div>
					{#each filteredChoices as choice}
						<Select.Item value={choice.value}>{choice.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		{#if ratePreview}
			<p class="text-xs text-muted-foreground text-right mx-2 -mt-1 mb-1">{ratePreview}</p>
		{/if}
		{#if isCustom}
			<div class="flex items-center justify-between mx-2 my-2">
				<div class="flex items-center gap-2">
					<Label class="text-sm font-normal">Custom Name</Label>
					<Tooltip.Root>
						<Tooltip.Trigger>
							<MaterialSymbolsHelpRounded class="size-4 text-neutral-300 hover:text-neutral-100" />
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>Symbol or short name for your custom currency</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</div>
				<Input type="text" class="w-20 text-center" maxlength={5} bind:value={customName} on:change={storeCustomName} />
			</div>
			<div class="flex items-center justify-between mx-2 my-2">
				<div class="flex items-center gap-2">
					<Label class="text-sm font-normal">Custom Rate</Label>
					<Tooltip.Root>
						<Tooltip.Trigger>
							<MaterialSymbolsHelpRounded class="size-4 text-neutral-300 hover:text-neutral-100" />
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>How many units of your currency equal 1 CNY (e.g. 6.9 means 1 CNY = 1/6.9 of your currency)</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</div>
				<Input
					type="number"
					class="w-24 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
					min="0.0001"
					step="0.01"
					bind:value={customRate}
					on:change={storeCustomRate}
				/>
			</div>
		{/if}
		{/if}
	</ul>
</div>
