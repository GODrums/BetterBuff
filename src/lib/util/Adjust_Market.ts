import Decimal from 'decimal.js';
import type { BuffTypes } from '../@types/BuffTypes';
import { BUFF_CRX, ExtensionStorage, WINDOW_G } from './storage';
import { SchemaHelpers } from './schemaHelpers';
import ListingOptions from '../pages/ListingOptions.svelte';
import { getListingDifference, priceToHtml } from './dataHelpers';

export async function adjustItemDetails(apiData: BuffTypes.ItemDescDetail.Data) {
    const container = document.querySelector('.popup-inspect-cont');
    const data = (container?.querySelector('.btn-buy-order') as HTMLElement | null)?.dataset;
    if (!container || !data?.goodsName) return;

    const name = data.goodsName;
    const isVanilla = name.includes('★') && !name.includes('|');
    const weaponSchema = SchemaHelpers.getWeaponSchema(name, isVanilla);

    // adjust price to show both CNY and CUR
    const priceContainer = container.querySelector('.scope-price');
    if (priceContainer && !priceContainer.querySelector('span')) {
        const strongElement = priceContainer.querySelector('strong');
        if (strongElement && data.price) {
            const priceCUR = priceContainer.querySelector('strong')?.textContent;

            strongElement.textContent = `¥ ${priceToHtml(parseFloat(data.price))}`;
            if (priceCUR) {
                strongElement.insertAdjacentHTML('afterend', `<span>(${priceCUR})</span>`);
            }
        }
    }

    // add listing options

    const assetInfo = JSON.parse(data?.assetInfo ?? '{}') as BuffTypes.SellOrder.AssetInfo;
    const listingData: Record<string, any> = {};

    if (weaponSchema) {
        const gen = SchemaHelpers.getInspectCode(weaponSchema, apiData.steam_asset_info.paintindex, apiData.steam_asset_info.paintseed, assetInfo.paintwear, apiData.steam_asset_info.stickers ?? []);
        listingData['gen'] = gen;
    }

    if (weaponSchema) {
        const goodsInfo = (document.querySelector('tr.selling') as HTMLElement | null)?.dataset.goodsInfo as unknown as BuffTypes.SellOrder.GoodsInfo | null;
        const min = parseFloat(assetInfo.paintwear.slice(0, 5));
        const max = min + 0.001;
        const floatdb_category = goodsInfo ? SchemaHelpers.getFloatDBCategory(goodsInfo.tags?.quality?.internal_name ?? 'normal') : undefined;

        listingData['matchFloat'] = `https://csgofloat.com/db?name=${weaponSchema.name}&defIndex=${weaponSchema.id}&paintIndex=${apiData.steam_asset_info.paintindex}&paintSeed=${
            apiData.steam_asset_info.paintseed
        }${floatdb_category ? `&category=${floatdb_category}` : ''}&min=${`${min}`.slice(0, 5)}&max=${`${max}`.slice(0, 5)}`;
    }

    if (apiData.qr_code_url) {
        listingData['share'] = apiData.qr_code_url;
    }

    const listingDiv = document.createElement('div');
    listingDiv.setAttribute('id', 'betterbuff-listing-anchor');
    listingDiv.setAttribute('style', 'display: flex; align-items: center;');
    listingDiv.setAttribute('data-betterbuff', JSON.stringify(listingData));
    container.querySelector('.scope-tags')?.insertAdjacentElement('afterend', listingDiv);

    if (BUFF_CRX) {
        const ui = await createShadowRootUi(BUFF_CRX, {
            name: 'demo-ui',
            css: '../components/style.css',
            position: 'inline',
            anchor: '#betterbuff-listing-anchor',
            onMount: (container) => {
                // Create the Svelte app inside the UI container
                const app = new ListingOptions({
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
}

export async function adjustSearchPage(apiData: BuffTypes.MarketGoods.Data) {
    const cards = Array.from(document.querySelectorAll('#j_list_card li')) as HTMLLIElement[];

    for (let i = 0, l = cards.length; i < l; i++) {
        const card = cards[i];
        const item = apiData.items[i];

        const priceContainer = card.querySelector('p');
        const currency = WINDOW_G?.currency;

        const itemH3 = card.querySelector('h3');
        if (itemH3) {
            itemH3.style.marginBottom = '12px';
        }

        if (priceContainer) {
            const sellingPriceCNY = parseFloat(item.sell_min_price);
            const buyingPriceCNY = parseFloat(item.buy_max_price);

            const priceGrid = document.createElement('div');
            priceGrid.setAttribute('style', 'display: grid; grid-template-columns: auto 25%; grid-template-rows: 20px 20px; align-items: center; margin: 2px 10px;');
            const genPriceElement = (priceCNY: number, color: string, text: 'sell' | 'buy', amount: number, priceCUR?: number) => {
                return `
                <div class="f_12px" style="grid-column: 1; text-wrap: nowrap;"><span style="color: ${color};font-weight: 700;">${priceToHtml(priceCNY, '¥')}${
                    priceCUR !== undefined && currency?.symbol ? ` | ${priceToHtml(priceCUR, currency?.symbol)}` : ''
                }</span> ${text} <small title="Amount of items">(${amount})</small></div>`;
            };
            const listingDifferenceStyle = await ExtensionStorage.listingDifferenceStyle.getValue();
            let differenceElement = '';
            if (listingDifferenceStyle > 0) {
                const steamTax = await ExtensionStorage.steamTax.getValue();
                differenceElement = getListingDifference(sellingPriceCNY, parseFloat(item.goods_info.steam_price_cny), listingDifferenceStyle, steamTax);
            }

            
            let sellingPriceCUR = undefined, buyingPriceCUR = undefined;
            // if user currency is CNY, don't show CUR
            if (currency?.symbol && currency?.symbol !== '¥') {
                sellingPriceCUR = new Decimal(item.sell_min_price)
                    .mul(currency?.rate_base_cny ?? 1)
                    .toDP(2)
                    .toNumber();
                buyingPriceCUR = new Decimal(item.buy_max_price)
                    .mul(currency?.rate_base_cny ?? 1)
                    .toDP(2)
                    .toNumber();
            }
            priceGrid.innerHTML =
                genPriceElement(sellingPriceCNY, '#eea20e', 'sell', item.sell_num, sellingPriceCUR) +
                genPriceElement(buyingPriceCNY, '#0e87ee', 'buy', item.buy_num, buyingPriceCUR) +
                `<div style="grid-column: 2; grid-row: 1 / span 2; text-align: end; white-space: nowrap;">${differenceElement}</div>`;
            priceContainer.replaceWith(priceGrid);
        }
    }
}

export function adjustTopBookmarked(apiData: BuffTypes.TopPopular.Data) {
    const cards = Array.from(document.querySelectorAll('#j_list_card li')) as HTMLLIElement[];

    for (let i = 0, l = cards.length; i < l; i++) {
        const card = cards[i];
        const item = apiData.items[i];
        const goodsInfo = apiData.goods_infos[item.asset_info.goods_id];

        // save item to card for tooltip
        card.dataset.item = JSON.stringify(item);

        // add price to show both CNY and CUR
        const priceContainer = card.querySelector('strong.sell_order_price');
        if (priceContainer) {
            const sellingPriceCNY = item.price.split('.');
            priceContainer.innerHTML = `¥ ${sellingPriceCNY[0]}${sellingPriceCNY[1] ? `<small>.${sellingPriceCNY[1]}</small>` : ''} | ` + priceContainer.innerHTML;
        }

        const tagBox = card.querySelector('.tagBox > .g_Right');
        const filter = 'filter: brightness(0) saturate(100%) invert(60%) sepia(57%) saturate(1118%) hue-rotate(170deg) brightness(103%) contrast(101%);';

        if (!tagBox) continue;
        tagBox.setAttribute('style', 'max-width: 40%; display: flex; justify-content: flex-end; flex-wrap: wrap; gap: 5px;');

        const aShare = document.createElement('a');
        aShare.innerHTML = '<i class="icon icon_link j_tips_handler" data-direction="bottom" data-title="Share"></i>';
        aShare.setAttribute(
            'href',
            `https://buff.163.com/goods/${item.goods_id}?appid=730&classid=${item.asset_info.classid}&instanceid=${item.asset_info.instanceid}&assetid=${item.asset_info.assetid}&contextid=2&sell_order_id=${item.id}`
        );
        aShare.setAttribute('target', '_blank');
        aShare.setAttribute('style', 'cursor: pointer;' + filter);
        tagBox.appendChild(aShare);

        const weaponSchema = SchemaHelpers.getWeaponSchema(goodsInfo.market_hash_name, goodsInfo.tags?.exterior?.internal_name == 'wearcategoryna');
        if (weaponSchema) {
            const gen = SchemaHelpers.getInspectCode(weaponSchema, item.asset_info.info.paintindex, item.asset_info.info.paintseed, item.asset_info.paintwear, item.asset_info.info.stickers);
            let aCopyGen = document.createElement('a');
            aCopyGen.setAttribute('title', gen);
            aCopyGen.setAttribute('style', 'cursor: pointer;');
            aCopyGen.innerHTML = `<i class="icon icon_notes j_tips_handler" data-direction="bottom" data-title="Copy !gen${
                weaponSchema?.type && weaponSchema.type == 'Gloves' ? 'gl' : ''
            }" style="${filter}"></i>`;
            aCopyGen.addEventListener('click', () => {
                navigator.clipboard.writeText(gen).then(() => {
                    window.postMessage({ type: 'toast', text: 'Copied to clipboard', success: true });
                });
            });
            tagBox.appendChild(aCopyGen);
        }
    }
}
