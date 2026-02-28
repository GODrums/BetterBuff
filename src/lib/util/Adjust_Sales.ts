import { convertCNY, isSelectedCurrencyCNY } from './currencyHelper';
import { priceToHtml } from './dataHelpers';
import { addItemLink, createMutationObserver } from './uiGeneration';

export async function handleSales() {
	createMutationObserver('.popup.popup_charge', addItemLink).observe(document.body, { childList: true, subtree: true });

	const cards = document.querySelectorAll('#j_list_card li.my_selling');
	for (let i = 0; i < cards.length; i++) {
		const card = <HTMLElement>cards[i];
		const price = card.dataset.price ?? '0';

		const priceDiv = card.querySelector('strong.f_Strong');

		if (priceDiv) {
			const priceCNY = Number.parseFloat(price);
			const converted = convertCNY(priceCNY);
			const convertedStr = !isSelectedCurrencyCNY() ? `${converted.symbol} ${converted.value}` : priceDiv.innerHTML;
			const newPrice = `<strong class="f_Strong">¥ ${priceToHtml(priceCNY)}</strong><span class="c_Gray f_12px" style="vertical-align: bottom;"> (${convertedStr})</span>`;
			priceDiv.outerHTML = newPrice;
		}
	}
}
