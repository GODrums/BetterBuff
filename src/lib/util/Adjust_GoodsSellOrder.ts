import type { BuffTypes } from '../@types/BuffTypes';
import { ExtensionStorage } from './storage';
import { SchemaHelpers } from './schemaHelpers';
import { BUFF_FLOAT_RANGES } from './globals';

export async function adjustGoodsSellOrder(apiData: BuffTypes.SellOrder.Data) {
    const goods_info = Object.values(apiData.goods_infos)?.pop() as BuffTypes.SellOrder.GoodsInfo;
    let rows = document.querySelectorAll('tr.selling');

    if (!apiData.items || goods_info.appid !== 730 || rows.length < 0) return;

    const weaponSchema = SchemaHelpers.getWeaponSchema(goods_info.market_hash_name, goods_info?.tags?.exterior?.internal_name == 'wearcategoryna');

    for (let i = 0; i < rows.length; i++) {
        let row = <HTMLElement>rows[i];
        let item = apiData.items[i];
        const wearContainer = <HTMLElement>row.querySelector('td.t_Left div.csgo_value');

        if (goods_info.short_name.includes('Souvenir Package')) {
            addSouvenirTeams(row, item.asset_info.info.tournament_tags);
        }

        if (!weaponSchema) continue;

        let elementsToAdd: HTMLElement[] = [];

        // const listingOptions = await storage.getItem<IStorage['listingOptions']>('local:listingOptions');
        const listingOptions = await ExtensionStorage.listingOptions.getValue();
        if (listingOptions.copyGen) {
            const gen = SchemaHelpers.getInspectCode(weaponSchema, item.asset_info.info.paintindex, item.asset_info.info.paintseed, item.asset_info.paintwear, item.asset_info?.info?.stickers ?? []);
            let aCopyGen = document.createElement('a');
            aCopyGen.setAttribute('class', 'ctag btn');
            aCopyGen.setAttribute('title', gen);
            aCopyGen.setAttribute('style', 'margin-top: 5px;');
            if (weaponSchema?.type && weaponSchema.type == 'Gloves') {
                aCopyGen.innerHTML = '<b><i class="icon icon_notes"></i></b>Copy !gengl';
            } else {
                aCopyGen.innerHTML = '<b><i class="icon icon_notes"></i></b>Copy !gen';
            }
            aCopyGen.addEventListener('click', () => {
                navigator.clipboard.writeText(gen);
            });
            elementsToAdd.push(aCopyGen);
        }

        if (listingOptions.matchFloat) {
            const min = parseFloat(item.asset_info.paintwear.slice(0, 5));
            const max = min + 0.001;
            const floatdb_category = SchemaHelpers.getFloatDBCategory(goods_info.tags?.quality?.internal_name ?? 'normal');
            const aMatchFloat = document.createElement('a');

            aMatchFloat.innerHTML = '<b><i style="margin-right: 1px;" class="icon icon_change"></i></b>Match floatdb';
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
            const aShare = document.createElement('a');
            aShare.innerHTML = '<b><i style="margin: -4px 0 0 0; filter: brightness(0);" class="icon icon_link"></i></b>Share';
            aShare.setAttribute('class', 'ctag btn');
            aShare.setAttribute('href', `https://buff.163.com/goods/${item.goods_id}?appid=730&classid=${item.asset_info.classid}&instanceid=${item.asset_info.instanceid}&assetid=${item.asset_info.assetid}&contextid=2&sell_order_id=${item.id}`);
            aShare.setAttribute('target', '_blank');
            aShare.setAttribute('style', 'margin-top: 5px;');
            elementsToAdd.push(aShare);
        }

        if (listingOptions.detail || true) {
            const aDetail = document.createElement('a');
            aDetail.innerHTML = '<b><i style="filter: invert(1);" class="icon icon_search"></i></b>Detail<br>';
            aDetail.setAttribute('class', 'ctag btn');
            aDetail.setAttribute('style', 'margin-top: 5px;');

            aDetail.addEventListener('click', () => {
                const detailImg = row.querySelector('div.item-detail-img');
                if (detailImg) {
                    (<HTMLElement>detailImg).click();
                }1
            });
            elementsToAdd.push(aDetail);
        }

        if (!listingOptions['3dinspect']) {
            wearContainer.querySelector('a.btn_3d')?.setAttribute('style', 'display: none;');
        }
        if (!listingOptions.inspectServer) {
            wearContainer.querySelector('a.btn_game_cms')?.setAttribute('style', 'display: none;');
        }
        if (!listingOptions['3dinspect'] && !listingOptions.inspectServer) {
            wearContainer.querySelector('br')?.setAttribute('style', 'display: none;');
        }

        for (const element of elementsToAdd) {
            wearContainer.appendChild(element);
        }

        if (Array.from(wearContainer.querySelectorAll('.ctag')).length > 3) {
            Array.from(wearContainer.querySelectorAll('.ctag'))[2].insertAdjacentHTML('afterend', '<br>');
        }
    }
}

function addSouvenirTeams(row: HTMLElement, tags: BuffTypes.CommonType.TournamentTag[]) {
    const teams = tags.map((x) => x.localized_name).slice(0, 2);
    const stickerContainer = <HTMLElement>row.querySelector('.csgo_sticker');
    const teamsDiv = document.createElement('div');
    teamsDiv.setAttribute('class', 'f_12px');
    teamsDiv.setAttribute('style', 'display: flex; flex-direction: column; align-items: center; color: #ffd700; opacity: 0.8;');
    teamsDiv.innerHTML = `<span>${teams[0]}</span><div class="clear"></div><span>vs</span><div class="clear"></div><span>${teams[1]}</span>`;
    stickerContainer.setAttribute('style', 'float: none;');
    stickerContainer.appendChild(teamsDiv);
}