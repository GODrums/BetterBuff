<script lang="ts">
import Decimal from 'decimal.js';
import type { BuffTypes } from '../@types/BuffTypes';

export let data: BuffTypes.PriceHistory.Data;
let isHovered = false,
	isClicked = false;

const minPrice = data.price_history.reduce((a, b) => Math.min(a, b[1]), Infinity);
const maxPrice = data.price_history.reduce((a, b) => Math.max(a, b[1]), -Infinity);
const priceChange = new Decimal(data.price_history[data.price_history.length - 1][1]).minus(data.price_history[0][1]);
const priceChangePercentage = priceChange.div(data.price_history[0][1]).times(100);

const minElement = data.price_history.find((e) => e[1] === minPrice)!;
const maxElement = data.price_history.find((e) => e[1] === maxPrice)!;
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div on:mouseover={() => isHovered = true} on:mouseleave={() => isHovered = false} on:click={() => isClicked=!isClicked} role="none">
    <slot />
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
                {priceChange.isNegative() ? '-': '+'}{data.currency_symbol}{priceChange.absoluteValue().toSD(3)} 
                <span class="font-medium text-base">({priceChangePercentage.isNaN() ? '0' : priceChangePercentage.toSD(3)}%)</span>
            </div>
              <div class="stat-desc">{new Date(data.price_history[0][0]).toLocaleDateString()} - {new Date(data.price_history[data.price_history.length - 1][0]).toLocaleDateString()}</div>
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
        border-bottom-width: 1px!important;
    }
</style>
