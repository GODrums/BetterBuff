<script lang="ts">
import Decimal from 'decimal.js';
import type { Snippet } from 'svelte';
import type { BuffTypes } from '../@types/BuffTypes';

let { data, children }: { data: BuffTypes.PriceHistory.Data; children: Snippet } = $props();
let isHovered = $state(false),
	isClicked = $state(false);

let listingLine = $derived(data.lines.find((line) => line.key === 'sell_min_price_history')?.points);
let minPrice = $derived(listingLine?.reduce((a, b) => Math.min(a, b[1]), Infinity));
let maxPrice = $derived(listingLine?.reduce((a, b) => Math.max(a, b[1]), -Infinity));
let priceChange = $derived(new Decimal(listingLine?.[listingLine.length - 1][1] ?? 0).minus(listingLine?.[0][1] ?? 0));
let priceChangePercentage = $derived(priceChange.div(listingLine?.[0][1] ?? 0).times(100));

let minElement = $derived(listingLine?.find((e) => e[1] === minPrice)!);
let maxElement = $derived(listingLine?.find((e) => e[1] === maxPrice)!);
</script>

<div onmouseover={() => (isHovered = true)} onmouseleave={() => (isHovered = false)} onclick={() => (isClicked = !isClicked)} onfocus={() => (isHovered = true)} onblur={() => (isHovered = false)} role="none">
	<!-- <slot /> -->
	 {@render children()}
</div>

{#if isHovered || isClicked}
	<div class="absolute bb-tooltip">
		<div class="stats stats-vertical shadow justify-items-center">
			<div class="stat w-auto bborder justify-items-center">
				<div class="stat-title">Minimum</div>
				<div class="stat-value text-xl">{data.currency_symbol} {minElement[1]}</div>
				<div class="stat-desc">{new Date(minElement[0]).toLocaleDateString()}</div>
			</div>
			<div class="stat w-auto bborder justify-items-center">
				<div class="stat-title">Maximum</div>
				<div class="stat-value text-xl">{data.currency_symbol} {maxElement[1]}</div>
				<div class="stat-desc">{new Date(maxElement[0]).toLocaleDateString()}</div>
			</div>
			<div class="stat w-auto px-4 justify-items-center">
				<div class="stat-title">Change</div>
				<div class="stat-value text-xl flex justify-center items-center gap-2">
					{priceChange.isNegative() ? "-" : "+"}{data.currency_symbol}{priceChange.absoluteValue().toSD(3)}
					<span class="font-medium text-base">({priceChangePercentage.isNaN() ? "0" : priceChangePercentage.toSD(3)}%)</span>
				</div>
				<div class="stat-desc">{new Date(listingLine?.[0][0] ?? Date.now()).toLocaleDateString()} - {new Date(listingLine?.[listingLine.length - 1][0] ?? 0).toLocaleDateString()}</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.bb-tooltip {
		translate: -40% 5%;
		border-radius: 4px;
	}
	.bborder {
		border-bottom-style: solid;
		border-bottom-width: 1px !important;
	}
</style>
