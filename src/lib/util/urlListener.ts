import type { BetterBuff } from '../@types/BetterBuff';
import { staticAdjustGoodsSellOrder } from './Adjust_GoodsSellOrder';
import { handleInventory } from './Adjust_Inventory';
import { handleSales } from './Adjust_Sales';
import { handleAccountPage, handleFavoritesPage } from './Adjust_UserCenter';

// listen for url changes and update the state accordingly
export function activateURLHandler() {
	browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
		if (message.type === 'BetterBuff_URL_CHANGED') {
			const state: BetterBuff.URLState = message.state;

			console.log('[BetterBuff] URL changed to: ', state);

			if (state.path === '/user-center/bookmark/sell_order') {
				handleFavoritesPage(state);
			} else if (state.path === '/user-center/profile') {
				await handleAccountPage();
			} else if (state.path === '/market/sell_order/on_sale') {
				await handleSales();
			} else if (state.path.startsWith('/goods/')) {
				staticAdjustGoodsSellOrder();
			} else if (state.path.startsWith('/market/steam_inventory')) {
				await handleInventory();
			}
		}
	});
}
