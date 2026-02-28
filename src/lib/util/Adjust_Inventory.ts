import type { BuffTypes } from '$lib/@types/BuffTypes';
import { convertCNY, isSelectedCurrencyCNY } from './currencyHelper';
import { priceToHtml } from './dataHelpers';
import { addItemLink, createMutationObserver } from './uiGeneration';

export async function handleInventory() {
	createMutationObserver('.popup.popup_charge', addItemLink).observe(document.body, { childList: true, subtree: true });

	let retries = 0;
	while (!document.querySelector('#j_list_card li.my_inventory') && retries < 20) {
		retries++;
		await new Promise((resolve) => setTimeout(resolve, 100));
	}

	const cards = document.querySelectorAll('#j_list_card li.my_inventory');
	for (let i = 0; i < cards.length; i++) {
		const card = <HTMLElement>cards[i];
		const itemInfo = JSON.parse(card.dataset.itemInfo ?? '{}') as BuffTypes.Inventory.ItemInfo;
		// const orderExtraInfo = JSON.parse(card.dataset.orderExtra ?? '{}') as BuffTypes.Inventory.OrderExtraInfo;

		const priceDiv = card.querySelector('strong.f_Strong');

		if (priceDiv) {
			const priceCNY = Number.parseFloat(itemInfo.price);
			const converted = convertCNY(priceCNY);
			let newPrice = `<strong class="f_Strong">¥ ${priceToHtml(priceCNY)}</strong>`;
			if (!isSelectedCurrencyCNY()) {
				newPrice += `<span class="c_Gray f_12px" style="vertical-align: bottom;"> (${priceToHtml(converted.valueRaw, converted.symbol, true)})</span>`;
			}
			priceDiv.outerHTML = newPrice;
		}
	}
}
