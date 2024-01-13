import Decimal from 'decimal.js';
import type { BuffTypes } from '../@types/BuffTypes';
import { WINDOW_G } from './storage';
import { TIME_TO_TEXT } from './globals';

export async function adjustShopSellOrder(apiData: BuffTypes.ShopSellOrder.Data) {
    const goods_info = Object.values(apiData.goods_infos)?.pop();
    let cards = document.querySelectorAll('li.my_shop_selling');

    if (!apiData.items || goods_info?.appid !== 730 || cards.length < 0) return;

    for (let i = 0; i < cards.length; i++) {
        let card = <HTMLElement>cards[i];
        let item = apiData.items[i];

        const priceDiv = card.querySelector('strong.f_Strong');

        if (priceDiv) {
            const cutPrice = parseInt(item.price);
            const newPrice = `<strong class="f_Strong">¥ ${cutPrice}<small>.${new Decimal(item.price)
                .minus(cutPrice)
                .mul(100)
                .toDP(2)
                .toNumber()}</small></strong><span class="c_Gray f_12px" style="vertical-align: bottom;"> (${priceDiv.innerHTML})</span>`;
            priceDiv.outerHTML = newPrice;
        }
    }
}

export async function adjustShopFeatured(apiData: BuffTypes.ShopFeatured.Data) {
    const goods_info = Object.values(apiData.goods_infos)?.pop();
    let cards = document.querySelectorAll('#j_recommend li');

    if (!apiData.items || goods_info?.appid !== 730 || cards.length < 0) return;

    for (let i = 0; i < cards.length; i++) {
        let card = <HTMLElement>cards[i];
        let item = apiData.items[i];

        const priceDiv = card.querySelector('strong.c_Yellow');

        if (priceDiv) {
            const h3 = card.querySelector('h3');
            if (h3) {
                h3.setAttribute('style', 'margin-bottom: 0;');
            }
            priceDiv.parentElement?.setAttribute('style', 'margin-top: 0;');

            const cutPrice = parseInt(item.price);
            const newPrice = `<strong class="c_Yellow">¥ ${cutPrice}<small>.${new Decimal(item.price)
                .minus(cutPrice)
                .mul(100)
                .toDP(2)
                .toNumber()}</small></strong><br><span class="c_Gray f_12px" style="vertical-align: bottom;"> (${priceDiv.innerHTML})</span>`;
            priceDiv.outerHTML = newPrice;
        }
    }
}

export async function adjustShopBillOrder(apiData: BuffTypes.ShopBillOrder.Data) {
    const goods_info = Object.values(apiData.goods_infos)?.pop();
    let rows = document.querySelectorAll('#recent-deal-container li');

    if (!apiData.items || goods_info?.appid !== 730 || rows.length < 0) return;

    for (let i = 0; i < rows.length; i++) {
        let row = <HTMLElement>rows[i];
        let item = apiData.items[i];
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
            const timePast = parseInt(textBox.innerText.split(timeString)[0]);
            const currency = WINDOW_G?.currency;

            textBox.innerHTML = `¥ ${item.price} (${currency?.symbol} ${new Decimal(item.price).mul(currency?.rate_base_cny ?? 1).toFixed(2)})`;

            const dateContainer = document.createElement('p');
            dateContainer.setAttribute('class', 'f_12px');
            dateContainer.innerHTML = `${timePast} ${TIME_TO_TEXT[timeString as keyof typeof TIME_TO_TEXT]}`

            row.append(dateContainer);
        }
    }
}
