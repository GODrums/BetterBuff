import type { BuffTypes } from '../@types/BuffTypes';
import { convertCNY, isSelectedCurrencyCNY } from './currencyHelper';
import { isPaymentMethodAvailable, priceToHtml } from './dataHelpers';
import { genListingAge } from './uiGeneration';

export async function adjustGoodsBuyOrder(apiData: BuffTypes.BuyOrder.Data) {
	const rows = document.querySelectorAll('.list_tb_csgo > tr');

	if (!apiData.items || rows.length < 0) return;

	for (let i = 1; i < rows.length; i++) {
		const row = <HTMLElement>rows[i];
		const item = apiData.items[i - 1];

		if (!item) {
			continue;
		}

		if (item.pay_method !== 43 && item.pay_method !== 60 && !(await isPaymentMethodAvailable([item.pay_method]))) {
			markPurchaseUnavailable(row);
		}

		// Converted price
		if (!isSelectedCurrencyCNY()) {
			const priceTd = row.querySelector<HTMLElement>('p.hide-cny');
			if (priceTd && !priceTd.querySelector('.betterbuff-converted')) {
				priceTd.style.display = 'block';
				const converted = convertCNY(Number.parseFloat(item.price));
				priceTd.innerHTML = `<span class="betterbuff-converted c_Gray f_12px">(${priceToHtml(converted.valueRaw, converted.symbol, true)})</span>`;
			}
		}

		// Listing age
		const listingContainer = row.querySelector('td.t_Left .user-info')?.parentElement;
		if (listingContainer) {
			const listingAge = genListingAge(item.created_at);
			listingContainer.insertAdjacentElement('afterend', listingAge);
		}
	}
}

function markPurchaseUnavailable(row: HTMLElement) {
	const purchaseButton = row.querySelector('td.t_Left > a.i_Btn');
	if (purchaseButton) {
		purchaseButton.setAttribute('style', 'background-color: gray; cursor: not-allowed;');
	}
}
