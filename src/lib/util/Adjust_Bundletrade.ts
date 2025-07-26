import type { BuffTypes } from '../@types/BuffTypes';
import { genListingAge } from './uiGeneration';

export async function adjustBundleInventory(apiData: BuffTypes.BundleInventory.Data) {
	const rows = document.querySelectorAll('.list_tb_csgo > tr:not(.tr_gallery)');

	if (!apiData.items || rows.length < 0) return;

	for (let i = 1; i < rows.length; i++) {
		const row = <HTMLElement>rows[i];
		const item = apiData.items[i - 1];

		// Listing Age
		const shopContainer = row.querySelector('.j_shoptip_handler');
		if (shopContainer) {
			const listingAge = genListingAge(item.created_at);
			shopContainer.insertAdjacentElement('afterend', listingAge);
		}

		// Add bargain button
		const aBuy = row.querySelector('a.btn-buy-order');
		if (aBuy && item.allow_bargain) {
			const aBargain = createBargainButton(aBuy, item);
			aBuy.parentElement?.appendChild(aBargain);
		}
	}
}

function createBargainButton(aBuy: Element, item: BuffTypes.BundleInventory.Item) {
	const aBargain = aBuy.cloneNode(true) as HTMLAnchorElement;
	aBargain.setAttribute('class', 'c_Blue2 bargain gM6');
	aBargain.setAttribute('style', 'margin-left: 15px;');
	aBargain.setAttribute('href', 'javascript:');
	aBargain.setAttribute('data-lowest-bargain-price', item.lowest_bargain_price);

	aBargain.removeAttribute('data-goods-sell-min-price');
	aBargain.removeAttribute('data-cooldown');

	aBargain.innerText = 'Bargain';

	return aBargain;
}

export async function adjustBundleOverview(apiData: BuffTypes.BundleOverview.Data) {
	const galleries = Array.from(document.querySelectorAll('.list_tb_csgo > tr.tr_gallery'));

	const row = galleries.find((row) => row.querySelector('.bundle-thums')?.getAttribute('data-orderid') === apiData.id);

	if (!row) {
		console.warn('[BetterBuff] Could not find row for bundle overview: ', apiData);
		return;
	}

	const listElements = Array.from(row.querySelectorAll('li'));

	for (const li of listElements) {
		const h5 = li.querySelector('h5');
		const itemLink = h5?.getAttribute('onclick')?.split("'")[1];

		if (!h5 || !itemLink) continue;

		const h4 = document.createElement('h4');
		h4.setAttribute('title', h5.getAttribute('title') ?? '');
		h4.setAttribute('style', 'padding: 0;font-size: 12px;overflow: hidden;height: 32px;line-height: 16px;margin: 6px 0 0;');
		h4.innerText = h5.innerText;
		h4.addEventListener('click', (e) => {
			e.preventDefault();
			e.stopPropagation();
			window.open(itemLink, '_blank');
		});

		h5.replaceWith(h4);
	}
}
