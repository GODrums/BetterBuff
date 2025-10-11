<script lang="ts">
import type { Snippet } from 'svelte';
import { fade, slide } from 'svelte/transition';
import BetterBuffLogo from '../../public/icon/512.png';
import type { BetterBuff } from '../@types/BetterBuff';

type Filter = {
	site: 'playside' | 'backside';
	range: 'min' | 'max';
	value: number;
};

let { weapon, data, children }: { weapon: string; data: BetterBuff.CHPatterns['weapon']; children?: Snippet } = $props();

const patterns = [...Array(1000).keys()].map((i) => [i, `${data.playside[i]}/${data.backside[i]}`]);

let isClicked = $state(false);
let searchTerm = $state('');
let extended = $state(false);
let filters = $state<Filter[]>([]);
let newFilterSite = $state<Filter['site']>('playside');
let newFilterRange = $state<Filter['range']>('min');
let newFilterValue = $state(0);
let filteredPatterns = $state(patterns);

let filterItems = $derived(filters.length);

function filterPatterns() {
	filteredPatterns = patterns.filter((pattern, index) => {
		if (searchTerm.length > 0 && !pattern[0].toString().includes(searchTerm)) {
			return false;
		}

		for (const filter of filters) {
			let blueValue = data[filter.site][pattern[0]];
			if (filter.range === 'min' && blueValue < filter.value) {
				return false;
			} else if (filter.range === 'max' && blueValue > filter.value) {
				return false;
			}
		}

		return true;
	});
}

function addFilter() {
	filters.push({
		site: newFilterSite,
		range: newFilterRange,
		value: newFilterValue,
	});

	newFilterSite = 'playside';
	newFilterRange = 'min';
	newFilterValue = 0;

	filterPatterns();
}

function removeFilter(index: number) {
	filters.splice(index, 1);
	filterPatterns();
}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div onclick={() => (isClicked = !isClicked)} role="button" tabindex="0">
	{@render children?.()}
</div>

{#if isClicked}
	<div class="absolute rounded-lg bg-[#191e24] p-4 pt-2 mt-2 z-50 text-white" transition:fade={{ delay: 0, duration: 200 }}>
		<div class="flex justify-between items-center gap-2 pb-1.5">
			<img src={BetterBuffLogo} class="w-8 h-8" alt="BetterBuff Logo" />
			<h2 class="text-xl font-bold">Pattern Explorer</h2>
			<button class="btn btn-circle btn-ghost btn-sm" onclick={() => (isClicked = !isClicked)} aria-label="Close">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
					><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg
				>
			</button>
		</div>
		<form class="py-2">
			<div class="flex justify-center items-center px-2">
				<label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
				<div class="relative">
					<span class="absolute inset-y-0 left-0 flex items-center pl-1">
						<button type="submit" class="btn btn-ghost h-8 min-h-8 p-1 focus:outline-none focus:shadow-outline" aria-label="Search">
							<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" class="w-5 h-5"
								><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg
							>
						</button>
					</span>
				<input
					type="search"
					name="q"
					class="input input-bordered h-8 bg-gray-800 py-1 text-sm text-white rounded-md pl-10 pr-2 focus:outline-none"
					placeholder="Search patterns..."
					bind:value={searchTerm}
					oninput={filterPatterns}
					autocomplete="off"
				/>
			</div>
			<button class="btn btn-ghost btn-sm p-1 ml-2" onclick={() => (extended = !extended)}>
				{#if extended}
					<svg class="h-6 w-6" viewBox="0 0 24 24"><path fill="currentColor" d="m12 10.8l-4.6 4.6L6 14l6-6l6 6l-1.4 1.4z" /></svg>
				{:else}
					<svg class="h-6 w-6" viewBox="0 0 24 24"><path fill="currentColor" d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z" /></svg>
				{/if}
			</button>
			</div>
			{#key filterItems}
				{#if filterItems > 0}
					<div class="flex items-center flex-wrap pt-2 max-w-64 gap-2">
					{#each filters as { site, range, value }, index}
						<div class="badge badge-info whitespace-nowrap pl-0 pr-1" transition:fade={{ delay: 100, duration: 200 }}>
							<button class="btn btn-circle btn-ghost btn-xs" onclick={() => removeFilter(index)} aria-label="Remove filter">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-4 h-4 stroke-current"
									><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg
								>
							</button>
							<span class="pr-0.5">{site === "playside" ? "front" : "back"}-{range}: {value}%</span>
						</div>
					{/each}
					</div>
				{/if}
			{/key}
			{#if extended}
				<div class="flex justify-center items-center pt-2" transition:slide>
					<select class="select select-ghost select-sm pl-2 pr-7 focus:outline-none" bind:value={newFilterSite}>
						<option value="playside">Playside</option>
						<option value="backside">Backside</option>
					</select>
					<select class="select select-ghost select-sm pl-2 pr-7 focus:outline-none" bind:value={newFilterRange}>
						<option value="min">Min</option>
						<option value="max">Max</option>
					</select>
				<input type="number" min="0" max="99" step="1" bind:value={newFilterValue} class="input input-sm w-10 pr-0 focus:outline-none" />
				<button class="btn btn-square btn-outline btn-sm p-1 ml-2" onclick={addFilter} aria-label="Add filter">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24"><path fill="#888888" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" /></svg>
				</button>
				</div>
			{/if}
		</form>

		<div class="overflow-x-auto h-80">
			<table class="table table-zebra table-pin-rows">
				<thead>
					<tr>
						<th>Pattern</th>
						<th>Blue%</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#each filteredPatterns as pattern}
						<tr>
							<td class="py-1">{pattern[0]}</td>
							<td class="py-1">{pattern[1]}</td>
							<th class="py-1">
								<a class="btn btn-square btn-ghost btn-xs" href="https://raw.githubusercontent.com/dnsmits/csbluegem_images/main/{weapon}/{weapon}_{pattern[0]}.png" target="_blank" aria-label="View pattern">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
										><path
											fill="#888888"
											d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h5v2H5v14h14v-5.35l2 2V19q0 .825-.587 1.413T19 21zm1-4l3-4l2.25 3l3-4L18 17zm15.55-3.6l-3.1-3.1q-.525.35-1.125.525T16.05 11q-1.85 0-3.15-1.312T11.6 6.5q0-1.875 1.313-3.187T16.1 2q1.875 0 3.188 1.313T20.6 6.5q0 .675-.2 1.3t-.5 1.15L22.95 12zM16.1 9q1.05 0 1.775-.725T18.6 6.5q0-1.05-.725-1.775T16.1 4q-1.05 0-1.775.725T13.6 6.5q0 1.05.725 1.775T16.1 9"
										/></svg
									>
								</a>
							</th>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}
