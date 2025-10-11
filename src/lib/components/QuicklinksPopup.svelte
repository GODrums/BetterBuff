<script lang="ts">
import type { Snippet } from 'svelte';
import { fade } from 'svelte/transition';

let { children }: { children: Snippet } = $props();

// Extract item name from page
const itemName = document.querySelector('h1')?.textContent || '';
const encodedItemName = encodeURIComponent(itemName.trim());

let isClicked = $state(false);

// Market configurations with their respective URLs
const markets = [
	{ name: 'Steam', url: `https://steamcommunity.com/market/listings/730/${encodedItemName}`, icon: 'https://pricempire.com/assets/providers/steam_icon.webp' },
	{ name: 'YouPin', url: `https://youpin898.com/market?gameId=730&search=${encodedItemName}`, icon: 'https://pricempire.com/assets/providers/youpin_icon.webp' },
	{ name: 'CSFloat', url: `https://csfloat.com/search?market_hash_name=${encodedItemName}&sort_by=lowest_price&type=buy_now`, icon: '	https://csfloat.com/assets/icons/logo.png' },
	{ name: 'Pricempire', url: `https://pricempire.com/item/${encodedItemName}`, icon: 'https://pbs.twimg.com/profile_images/1903548441952706560/kj4j4k8Z_400x400.jpg' },
];
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div onclick={() => (isClicked = !isClicked)} role="button" tabindex="0" class="h-6 min-h-6 max-h-6">
	{@render children()}
</div>

{#if isClicked}
	<div class="absolute rounded-md bg-[#191e24] p-2 mt-1 z-50 shadow-lg border border-gray-700" transition:fade={{ delay: 0, duration: 150 }}>
		<div class="flex flex-col gap-0.5">
			{#each markets as market}
				<a
					href={market.url}
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-2 pl-2 pr-6 py-1.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors"
				>
					<img src={market.icon} alt={market.name} class="w-4 h-4 rounded-sm" />
					{market.name}
				</a>
			{/each}
		</div>
	</div>
{/if}