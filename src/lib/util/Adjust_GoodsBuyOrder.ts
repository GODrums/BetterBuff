import type { BuffTypes } from '../@types/BuffTypes';
import { isPaymentMethodAvailable } from './dataHelpers';
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
