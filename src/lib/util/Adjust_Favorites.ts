import type { BetterBuff } from "../@types/BetterBuff";
import type { BuffTypes } from "../@types/BuffTypes";

export function handleFavoritesPage(state: BetterBuff.URLState) {
    if (state.search.indexOf('game=csgo') == -1) return;

    const rows = Array.from(document.querySelectorAll('tr.bookmark_order')) as HTMLElement[];

    for (const row of rows) {
        const assetInfo = JSON.parse(row.dataset.assetInfo ?? '{}') as BuffTypes.SellOrder.AssetInfo;
        const goodsInfo = JSON.parse(row.dataset.goodsInfo ?? '{}') as BuffTypes.SellOrder.GoodsInfo;
        const orderInfo = JSON.parse(row.dataset.orderInfo ?? '{}') as BuffTypes.SellOrder.OrderInfo;

        
    }
}