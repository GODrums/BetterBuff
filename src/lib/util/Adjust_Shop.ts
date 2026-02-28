import Decimal from 'decimal.js';
import type { BuffTypes } from '../@types/BuffTypes';
import { convertCNY, isSelectedCurrencyCNY } from './currencyHelper';
import { priceToHtml } from './dataHelpers';
import { TIME_TO_TEXT } from './globals';

export async function adjustShopSellOrder(apiData: BuffTypes.ShopSellOrder.Data) {
	const goods_info = Object.values(apiData.goods_infos)?.pop();
	const cards = document.querySelectorAll('li.my_shop_selling');

	if (!apiData.items || goods_info?.appid !== 730 || cards.length < 0) return;

	for (let i = 0; i < cards.length; i++) {
		const card = <HTMLElement>cards[i];
		const item = apiData.items[i];

		const priceDiv = card.querySelector('strong.f_Strong');

		if (priceDiv) {
			const priceCNY = Number.parseFloat(item.price);
			const converted = convertCNY(priceCNY);
			const convertedStr = !isSelectedCurrencyCNY() ? `${converted.symbol} ${converted.value}` : priceDiv.innerHTML;
			const newPrice = `<strong class="f_Strong">¥ ${priceToHtml(priceCNY)}</strong><span class="c_Gray f_12px" style="vertical-align: bottom;"> (${convertedStr})</span>`;
			priceDiv.outerHTML = newPrice;
		}
	}
}

export async function adjustShopFeatured(apiData: BuffTypes.ShopFeatured.Data) {
	const goods_info = Object.values(apiData.goods_infos)?.pop();
	const cards = document.querySelectorAll('#j_recommend li');

	if (!apiData.items || goods_info?.appid !== 730 || cards.length < 0) return;

	for (let i = 0; i < cards.length; i++) {
		const card = <HTMLElement>cards[i];
		const item = apiData.items[i];

		const priceDiv = card.querySelector('strong.c_Yellow');

		if (priceDiv) {
			const h3 = card.querySelector('h3');
			if (h3) {
				h3.setAttribute('style', 'margin-bottom: 0;');
			}
			priceDiv.parentElement?.setAttribute('style', 'margin-top: 0;');

			const priceCNY = Number.parseFloat(item.price);
			const converted = convertCNY(priceCNY);
			const convertedStr = !isSelectedCurrencyCNY() ? `${converted.symbol} ${converted.value}` : priceDiv.innerHTML;
			const newPrice = `<strong class="c_Yellow">¥ ${priceToHtml(priceCNY)}</strong><br><span class="c_Gray f_12px" style="vertical-align: bottom;"> (${convertedStr})</span>`;
			priceDiv.outerHTML = newPrice;
		}
	}
}

export async function adjustShopBillOrder(apiData: BuffTypes.ShopBillOrder.Data) {
	const goods_info = Object.values(apiData.goods_infos)?.pop();
	const rows = document.querySelectorAll('#recent-deal-container li');

	if (!apiData.items || goods_info?.appid !== 730 || rows.length < 0) return;

	for (let i = 0; i < rows.length; i++) {
		const row = <HTMLElement>rows[i];
		const item = apiData.items[i];
		const textBox = row.querySelector('p');

		if (textBox) {
			row.setAttribute('style', 'padding-top: 10px; padding-bottom: 10px; border-bottom: 1px solid;');
			const aImgContainer = row.querySelector('a.recent-deal-img');
			if (aImgContainer) {
				aImgContainer.setAttribute('style', 'margin-bottom: 10px;');
			}

			let timeString = '';
			for (const key in TIME_TO_TEXT) {
				if (textBox.innerText.endsWith(key)) {
					timeString = key;
					break;
				}
			}
			const timePast = Number.parseInt(textBox.innerText.split(timeString)[0]);
			const converted = convertCNY(Number.parseFloat(item.price));

			textBox.innerHTML = `¥ ${item.price} (${converted.symbol} ${converted.value})`;

			const dateContainer = document.createElement('p');
			dateContainer.setAttribute('class', 'f_12px');
			dateContainer.innerHTML = `${timePast} ${TIME_TO_TEXT[timeString as keyof typeof TIME_TO_TEXT]}`;

			row.append(dateContainer);
		}
	}
}
