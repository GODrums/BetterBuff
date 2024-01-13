import { handleAccountPage, handleFavoritesPage } from "./Adjust_UserCenter";

// listen for url changes and update the state accordingly
export function activateURLHandler() {
    browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        if (message.type === 'BetterBuff_URL_CHANGED') {
            const state = message.state;

            console.log('[BetterBuff] URL changed to: ', state);
            
            switch (state.path) {
                case '/user-center/bookmark/sell_order':
                    handleFavoritesPage(state);
                    break;
                case '/user-center/profile':
                    await handleAccountPage(state);
                    break;
                default:
                    break;
            }
        }
    });
}