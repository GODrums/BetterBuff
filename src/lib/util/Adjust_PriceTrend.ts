import { mount, unmount } from 'svelte';
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

	if (BUFF_CRX) {
		const ui = await createShadowRootUi(BUFF_CRX, {
			name: 'app-price-trend',
			css: '../components/style.css',
			position: 'inline',
			anchor: infoDiv,
			onMount: (container) => {
				return mount(PriceHistoryInfo, {
					target: container,
				});
			},
			onRemove: (app) => {
				unmount(app as Record<string, any>);
			},
		});
		ui.mount();
	}
}
