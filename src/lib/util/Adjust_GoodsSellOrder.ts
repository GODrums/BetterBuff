import type { BuffTypes } from '../@types/BuffTypes';
import { ExtensionStorage, type IStorage } from './storage';
import { SchemaHelpers } from './schemaHelpers';
import { BUFF_FLOAT_RANGES } from './globals';
import Decimal from 'decimal.js';
import { addSouvenirTeams, genCopyGenButton, genShareButton } from './uiGeneration';
import { isPaymentMethodAvailable } from './dataHelpers';

export async function adjustGoodsSellOrder(apiData: BuffTypes.SellOrder.Data) {
    const goods_info = Object.values(apiData.goods_infos)?.pop() as BuffTypes.SellOrder.GoodsInfo | undefined;
    let rows = document.querySelectorAll('tr.selling');

    if (!apiData.items || !goods_info || goods_info.appid !== 730 || rows.length < 0) return;

    const weaponSchema = SchemaHelpers.getWeaponSchema(goods_info.market_hash_name, goods_info?.tags?.exterior?.internal_name == 'wearcategoryna');

    console.log('API Data: ', apiData);

    const showBigPreviews = await ExtensionStorage.showBigPreviews.getValue();
    const listingOptions = await ExtensionStorage.listingOptions.getValue();

    for (let i = 0; i < rows.length; i++) {
        let row = <HTMLElement>rows[i];
        let item = apiData.items[i];

        if (row.classList.contains('betterbuff-done')) continue;
        
        if (goods_info.short_name.includes('Souvenir Package')) {
            addSouvenirTeams(row.querySelector('.csgo_sticker') as HTMLElement, item.asset_info.info.tournament_tags);
        }

        await addStickerPercentage(row, item);

        await addListingAge(row, item);

        if (weaponSchema) {
            await adjustListingOptions(weaponSchema, item, goods_info, row, listingOptions);
        }

        if (!await isPaymentMethodAvailable(item.supported_pay_methods)) {
            markPurchaseUnavailable(row);
        }

        if (showBigPreviews) {
            addBigPreviews(row, item);
        }

        row.classList.add('betterbuff-done');
    }
}

function addBigPreviews(row: HTMLElement, item: BuffTypes.SellOrder.Item) {
    if (!item.img_src.includes('fop')) return;
    const bigPreview = document.createElement('div');
    bigPreview.setAttribute('class', 'betterbuff-item-detail-img');
    bigPreview.setAttribute('style', 'display: none; max-width: 600px; max-height: 400px;');

    const img = document.createElement('img');
    img.setAttribute('src', item.img_src.split('%7CimageView')[0]);
    img.setAttribute('style', 'width: 50%; object-fit: contain; translate: -5% -50%;');

    bigPreview.appendChild(img);

    const itemImage = row.querySelector('td.img_td');
    itemImage?.appendChild(bigPreview);

    itemImage?.addEventListener('mouseover', () => {
        bigPreview.setAttribute('style', 'display: block;');
    });

}

function markPurchaseUnavailable(row: HTMLElement) {
    const purchaseButton = row.querySelector('td.t_Left > a.i_Btn');
    if (purchaseButton) {
        purchaseButton.setAttribute('style', 'background-color: gray; cursor: not-allowed;');
    }
}

async function addStickerPercentage(row: HTMLElement, item: BuffTypes.SellOrder.Item) {
    const spElement = row.querySelector('span.stag_sp');
    if (item.sticker_premium == null || !spElement) return;

    const csgoSticker = row.querySelector('.csgo_sticker');
    csgoSticker?.insertAdjacentHTML('afterbegin', '<div class="sticker-premium"></div>');
    csgoSticker?.firstElementChild?.appendChild(spElement);

    const spData = (<HTMLElement>spElement).dataset;
    let stickerPercentage = new Decimal(item.sticker_premium).mul(100);
    spData.rate = stickerPercentage.toDP(2).toString() + '%';
    spElement.innerHTML = spData.rate;
}

async function addListingAge(row: HTMLElement, item: BuffTypes.SellOrder.Item) {
    let date = new Date(item.created_at * 1_000);
    let timeEpoch = Date.now() - item.created_at * 1_000;
    let dateHours = Math.floor(timeEpoch / 3_600_000);
    let dateDiv = document.createElement('div');

    dateDiv.setAttribute('title', date.toUTCString());
    dateDiv.setAttribute('style', 'font-size: 12px; color: #959595; transform: translate(4.5%, 20%);');

    let dateText = `${dateHours < 49 ? `${dateHours} hour${dateHours == 1 ? '' : 's'}` : `${Math.floor(timeEpoch / 3_600_000 / 24)} days`} ago`;
    dateDiv.innerHTML = `<i class="icon icon_time"></i><p style="display: inline; vertical-align: middle; margin-left: 5px;">${dateText}</p>`;

    (<NodeListOf<HTMLElement>>row.querySelectorAll('td.t_Left')).forEach((element) => {
        if (element.querySelector('.user-thum')) {
            element.appendChild(dateDiv);
        }
    });
    row.querySelector('td.t_Left > .j_shoptip_handler')?.parentElement?.appendChild(dateDiv);
}

async function adjustListingOptions(weaponSchema: SchemaHelpers.WeaponSchema, item: BuffTypes.SellOrder.Item, goods_info: BuffTypes.SellOrder.GoodsInfo, row: HTMLElement, listingOptions: IStorage['listingOptions']) {
    const wearContainer = <HTMLElement>row.querySelector('td.t_Left div.csgo_value');
    let elementsToAdd: HTMLElement[] = [];

    if (listingOptions.copyGen) {
        let aCopyGen = genCopyGenButton(weaponSchema, item.asset_info.info.paintindex, item.asset_info.info.paintseed, item.asset_info.paintwear, item.asset_info?.info?.stickers ?? [])
        elementsToAdd.push(aCopyGen);
    }

    if (listingOptions.matchFloat) {
        const min = parseFloat(item.asset_info.paintwear.slice(0, 5));
        const max = min + 0.001;
        const floatdb_category = SchemaHelpers.getFloatDBCategory(goods_info.tags?.quality?.internal_name ?? 'normal');
        const aMatchFloat = document.createElement('a');

        aMatchFloat.innerHTML = '<b><i style="margin-right: 1px;" class="icon icon_change"></i></b>Match Floatdb';
        aMatchFloat.setAttribute('class', 'ctag btn');
        aMatchFloat.setAttribute('style', 'margin-top: 5px;');
        aMatchFloat.setAttribute(
            'href',
            `https://csgofloat.com/db?name=${weaponSchema.name}&defIndex=${weaponSchema.id}&paintIndex=${item.asset_info.info.paintindex}&paintSeed=${
                item.asset_info.info.paintseed
            }&category=${floatdb_category}&min=${`${min}`.slice(0, 5)}&max=${`${max}`.slice(0, 5)}`
        );
        aMatchFloat.setAttribute('target', '_blank');
        elementsToAdd.push(aMatchFloat);
    }

    if (listingOptions.findSimilar) {
        const min = parseFloat(item.asset_info.paintwear.slice(0, 5));

        const aFindSimilar = document.createElement('a');
        aFindSimilar.innerHTML = '<b><i style="filter: invert(1);" class="icon icon_search"></i></b>Find Similar<br>';
        aFindSimilar.setAttribute('class', 'ctag btn');
        aFindSimilar.setAttribute('style', 'margin-top: 5px;');
        aFindSimilar.addEventListener('click', () => {
            const paramData = {
                min_paintwear: '',
                max_paintwear: '',
                extra_tag_ids: 'non_empty',
                wearless_sticker: '',
            };

            for (const _range of BUFF_FLOAT_RANGES) {
                if (_range[0] > min) {
                    paramData.min_paintwear = _range[1][0];
                    paramData.max_paintwear = _range[1][1];
                    break;
                }
            }

            const stickers = item.asset_info?.info?.stickers ?? [];

            if (stickers.length > 0) {
                paramData.extra_tag_ids = stickers.length == weaponSchema.sticker_amount ? 'squad_combos' : 'non_empty';

                if (stickers.filter((x) => x.wear == 0).length == stickers.length) {
                    paramData.wearless_sticker = '1';
                }
            }

            const url = new URL(location.href);
            url.searchParams.append('min_paintwear', paramData.min_paintwear);
            url.searchParams.append('max_paintwear', paramData.max_paintwear);
            url.searchParams.append('extra_tag_ids', paramData.extra_tag_ids);
            url.searchParams.append('wearless_sticker', paramData.wearless_sticker);
            window.open(url, '_self');
        });
        elementsToAdd.push(aFindSimilar);
    }

    if (listingOptions.share) {
        const aShare = genShareButton(item.goods_id, item.asset_info.classid, item.asset_info.instanceid, item.asset_info.assetid, item.id);
        elementsToAdd.push(aShare);
    }

    if (listingOptions.detail || true) {
        const aDetail = document.createElement('a');
        aDetail.innerHTML = '<b><i style="filter: invert(1);" class="icon icon_search"></i></b>Detail';
        aDetail.setAttribute('class', 'ctag btn');
        aDetail.setAttribute('style', 'margin-top: 5px;');

        aDetail.addEventListener('click', () => {
            const detailImg = row.querySelector('div.item-detail-img');
            if (detailImg) {
                (<HTMLElement>detailImg).click();
            }
            1;
        });
        elementsToAdd.push(aDetail);
    }

    if (!listingOptions['3dinspect']) {
        wearContainer.querySelector('a.btn_3d')?.setAttribute('style', 'display: none;');
    }
    if (!listingOptions.inspectIngame) {
        wearContainer.querySelector('a.btn_action_link')?.setAttribute('style', 'display: none;');
    }
    if (!listingOptions.inspectServer) {
        wearContainer.querySelector('a.btn_game_cms')?.setAttribute('style', 'display: none;');
    }
    if (!listingOptions['3dinspect'] && !listingOptions.inspectServer) {
        wearContainer.querySelector('br')?.setAttribute('style', 'display: none;');
    }

    const initElementCount = (listingOptions['3dinspect'] ? 1 : 0) + (listingOptions.inspectIngame ? 1 : 0) + (listingOptions.inspectServer ? 1 : 0);
    if (initElementCount === 3) {
        wearContainer.appendChild(document.createElement('br'));
    }
    for (let i=0; i<elementsToAdd.length; i++) {
        const element = elementsToAdd[i];
        wearContainer.appendChild(element);
        if ((initElementCount + i > 0) && ((initElementCount + i + 1) % 3 == 0)) {
            wearContainer.appendChild(document.createElement('br'));
        }
    }
}
