import Decimal from "decimal.js";
import type { BuffTypes } from "../@types/BuffTypes";
import { WINDOW_G } from "./storage";

export function adjustSearchPage(apiData: BuffTypes.MarketGoods.Data) {
    const cards = Array.from(document.querySelectorAll('#j_list_card li')) as HTMLLIElement[];

    for (let i = 0, l = cards.length; i < l; i ++) {
        const card = cards[i];
        const item = apiData.items[i];

        const priceContainer = card.querySelector('p');
        const currency = WINDOW_G?.currency;

        const itemH3 = card.querySelector('h3');
        if (itemH3) {
            itemH3.style.marginBottom = '12px';
        }

        if (priceContainer) {
            const sellingPriceCNY = item.sell_min_price.split('.');
            const sellingPriceCUR = new Decimal(item.sell_min_price).mul(currency?.rate_base_cny ?? 1).toFixed(2).split('.');
            const buyingPriceCNY = item.buy_max_price.split('.');
            const buyingPriceCUR = new Decimal(item.buy_max_price).mul(currency?.rate_base_cny ?? 1).toFixed(2).split('.');
            const priceDiffPercentage = new Decimal(item.goods_info.steam_price_cny).sub(item.sell_min_price).div(item.sell_min_price).mul(100).mul(-1).toNumber();


            const priceGrid = document.createElement('div');
            priceGrid.setAttribute('style', 'display: grid; grid-template-columns: auto 20%; grid-template-rows: 20px 20px; align-items: center; margin: 2px 10px;');
            const genPriceFormatted = (parts: string[], symbol: string) => {
                if (!parts) return '';
                let dps = ``;
                if (parseInt(parts[0]) < 1000 && parts[1]) {
                    const cutDps = parts[1].split('0')[0];
                    if (cutDps.length > 0) {
                        dps = `<small>.${cutDps}</small>`;
                    }
                }
                return `${symbol}${parts[0]}${dps}`;
            }
            const genPriceElement = (partsCNY: string[], color: string, text: 'sell' | 'buy', amount: number, partsCUR?: string[]) => {
                return `
                <div class="f_12px" style="grid-column: 1; text-wrap: nowrap;"><span style="color: ${color};font-weight: 700;">${genPriceFormatted(partsCNY, '¥')}${partsCUR && currency?.symbol ? ` | ${genPriceFormatted(partsCUR, currency?.symbol)}` : ''}</span> ${text} <small title="Amount of items">(${amount})</small></div>`;
            }
            priceGrid.innerHTML = genPriceElement(sellingPriceCNY, '#eea20e', 'sell', item.sell_num, sellingPriceCUR) + genPriceElement(buyingPriceCNY, '#0e87ee', 'buy', item.buy_num, buyingPriceCUR) + `<div style="grid-column: 2; grid-row: 1 / span 2; text-align: end;"><span class="f_12px" style="color: ${priceDiffPercentage < 0 ? '#009800' : '#c90000'};font-weight: 700;">${priceDiffPercentage.toFixed(1)}%</span></div>`;
            priceContainer.replaceWith(priceGrid);
        }

    }
}