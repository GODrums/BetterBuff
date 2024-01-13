import type { BetterBuff } from '../@types/BetterBuff';
import type { BuffTypes } from '../@types/BuffTypes';
import { SchemaHelpers } from './schemaHelpers';
import { ExtensionStorage } from './storage';
import { addSouvenirTeams, genCopyGenButton, genShareButton } from './uiGeneration';

export async function handleAccountPage(state: BetterBuff.URLState) {
    const dataProtection = await ExtensionStorage.dataProtection.getValue();

    if (!dataProtection) {
        const blurStyle = 'filter: none;';
        document.querySelector('#mobile')?.setAttribute('style', blurStyle);
        document.querySelector('tr.steam_bind a')?.setAttribute('style', blurStyle);
    }

    const oldSettings = `<h3>BetterBuff</h3><p>If you are looking for the BetterBuff-Settings, please use the extension popup available through your browser's toolbar.</p>`
    document.querySelector('.user-setting')?.insertAdjacentHTML('beforeend', oldSettings);
}

export function handleFavoritesPage(state: BetterBuff.URLState) {
    if (state.search.indexOf('game=csgo') == -1) return;

    const rows = Array.from(document.querySelectorAll('tr.bookmark_order')) as HTMLElement[];

    for (const row of rows) {
        const assetInfo = JSON.parse(row.dataset.assetInfo ?? '{}') as BuffTypes.SellOrder.AssetInfo;
        const goodsInfo = JSON.parse(row.dataset.goodsInfo ?? '{}') as BuffTypes.SellOrder.GoodsInfo;
        const orderInfo = JSON.parse(row.dataset.orderInfo ?? '{}') as BuffTypes.SellOrder.OrderInfo;

        console.log('[BetterBuff] Asset info: ', assetInfo, ', Goods info: ', goodsInfo, ', Order info: ', orderInfo);

        if (goodsInfo.name.endsWith('Souvenir Package')) {
            addSouvenirTeams(row.querySelector('.csgo_sticker') as HTMLElement, assetInfo.info.tournament_tags);
        }

        const weaponSchema = SchemaHelpers.getWeaponSchema(goodsInfo.market_hash_name, goodsInfo.tags?.exterior?.internal_name == 'wearcategoryna');
        const nameContainer = row.querySelector('div.name-cont h3');
        const targetId = row.querySelector('[data-target-id]');
        if (nameContainer && nameContainer.parentElement && targetId) {
            const elementDiv = document.createElement('div');
            elementDiv.setAttribute('style', 'display: flex; gap: 5px;');
            if (weaponSchema) {
                let aCopyGen = genCopyGenButton(weaponSchema, assetInfo.info.paintindex, assetInfo.info.paintseed, assetInfo.paintwear, assetInfo.info.stickers);
                elementDiv.appendChild(aCopyGen);
            }
            const itemId = targetId.getAttribute('data-target-id');
            if (itemId) {
                let aShare = genShareButton(goodsInfo.goods_id, assetInfo.classid, assetInfo.instanceid, assetInfo.assetid, itemId);
                elementDiv.appendChild(aShare);
            }
            nameContainer.parentElement.appendChild(elementDiv);
        }

        const aBuy = row.querySelector('a.btn-buy-order');
        if (aBuy) {
            // TODO: check if item is even bargainable
            const price = parseFloat(aBuy.getAttribute('data-price') ?? '0');
            const lowest_bargain_price = price * 0.8;

            const aBargain = aBuy.cloneNode(true) as HTMLAnchorElement;

            if (price >= 100) {
                aBuy.parentElement?.setAttribute('style', 'line-height: 200%;');

                aBargain.setAttribute('class', 'i_Btn i_Btn_mid bargain');
                aBargain.setAttribute('style', 'margin-left: 5px;');
                aBargain.setAttribute('data-lowest-bargain-price', `${lowest_bargain_price.toFixed(1)}`);

                aBargain.removeAttribute('data-goods-sell-min-price');
                aBargain.removeAttribute('data-cooldown');

                aBargain.innerText = 'Bargain';

                aBuy.parentElement?.querySelector('span')?.setAttribute('style', 'margin-left: 50px;');
                aBuy.parentElement?.querySelector('a')?.after(aBargain);
            }
        }
    }
}
