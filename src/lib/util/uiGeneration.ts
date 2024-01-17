import type { BuffTypes } from '../@types/BuffTypes';
import { SchemaHelpers } from './schemaHelpers';

export function genShareButton(goods_id: number, classid: string, instanceid: string, assetid: string, id: string) {
    const aShare = document.createElement('a');
    aShare.innerHTML = '<b><i style="margin: -4px 0 0 0;" class="icon icon_link"></i></b>Share';
    aShare.setAttribute('class', 'ctag btn');
    aShare.setAttribute('href', `https://buff.163.com/goods/${goods_id}?appid=730&classid=${classid}&instanceid=${instanceid}&assetid=${assetid}&contextid=2&sell_order_id=${id}`);
    aShare.setAttribute('target', '_blank');
    aShare.setAttribute('style', 'margin-top: 5px;');
    return aShare;
}

export function genCopyGenButton(
    weaponSchema: SchemaHelpers.WeaponSchema,
    paintindex: number,
    paintseed: number,
    paintwear: string,
    stickers: { slot: number; sticker_id: number; wear?: number | undefined }[]
) {
    const gen = SchemaHelpers.getInspectCode(weaponSchema, paintindex, paintseed, paintwear, stickers);
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
        navigator.clipboard.writeText(gen).then(() => {
            window.postMessage({ type: 'toast', text: 'Copied to clipboard', success: true });
        });
    });
    return aCopyGen;
}

export function addSouvenirTeams(stickerContainer: HTMLElement, tags: BuffTypes.CommonType.TournamentTag[]) {
    if (!stickerContainer) return;
    const teams = tags.map((x) => x.localized_name).slice(0, 2);
    const teamsDiv = document.createElement('div');
    teamsDiv.setAttribute('class', 'f_12px');
    teamsDiv.setAttribute('style', 'display: flex; flex-direction: column; align-items: center; color: #ffd700; opacity: 0.8;');
    teamsDiv.innerHTML = `<span>${teams[0]}</span><div class="clear"></div><span>vs</span><div class="clear"></div><span>${teams[1]}</span>`;
    stickerContainer.setAttribute('style', 'float: none;');
    stickerContainer.appendChild(teamsDiv);
}
