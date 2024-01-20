import type { BuffTypes } from '../@types/BuffTypes';
import PriceHistoryInfo from '../pages/PriceHistoryInfo.svelte';
import { BUFF_CRX } from './storage';

export async function adjustPriceTrend(apiData: BuffTypes.PriceHistory.Data) {
    const infoDiv = document.createElement('div');
    infoDiv.id = 'betterbuff-pricetrend-info';
    infoDiv.setAttribute('id', 'betterbuff-pricetrend-info');
    infoDiv.setAttribute('style', 'display: inline-block; vertical-align: middle; margin-left: 20px;');
    infoDiv.setAttribute('data-betterbuff', JSON.stringify(apiData));
    document.querySelector('#price-history-days')?.insertAdjacentElement('afterend', infoDiv);

    const ui = await createShadowRootUi(BUFF_CRX, {
        name: 'demo-ui',
        css: '../components/style.css',
        position: 'inline',
        anchor: '#betterbuff-pricetrend-info',
        onMount: (container) => {
            // Create the Svelte app inside the UI container
            const app = new PriceHistoryInfo({
                target: container,
            });
            return app;
        },
        onRemove: (app) => {
            // Destroy the app when the UI is removed
            app?.$destroy();
        },
    });

    // 4. Mount the UI
    ui.mount();
}
