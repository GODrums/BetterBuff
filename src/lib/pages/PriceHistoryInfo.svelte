<script lang="ts">
import type { BuffTypes } from '../@types/BuffTypes';
import InfoTooltip from '../components/InfoTooltip.svelte';
import '../components/style.css';

let data: BuffTypes.PriceHistory.Data = JSON.parse(document.querySelector('#betterbuff-pricetrend-info')?.getAttribute('data-betterbuff') ?? '{}');
</script>

{#if data.price_history}
    <InfoTooltip {data}>
        <div class="text-[#4773C8] hover:text-[#2E3135]">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                ><path
                    fill="currentColor"
                    d="M11 17h2v-6h-2zm1-8q.425 0 .713-.288T13 8q0-.425-.288-.712T12 7q-.425 0-.712.288T11 8q0 .425.288.713T12 9m0 13q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22" /></svg>
        </div>
    </InfoTooltip>
{/if}
