import type { BetterBuff } from "@/lib/@types/BetterBuff";
import { ExtensionStorage } from "@/lib/util/storage";

export default defineBackground(() => {
    console.log('Hello background!', { id: browser.runtime.id });
    ExtensionStorage.enabled.getValue().then((enabled) => {
        console.log('enabled: ', enabled);
    });
    browser.runtime.onInstalled.addListener(() => {
        console.log('onInstalled');
    });
    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete') {
            if (!tab.url) return;
            const url = new URL(tab.url);
            const state: BetterBuff.URLState = {
                path: url.pathname,
                search: url.search,
                hash: url.hash
            };
            console.log('[BetterBuff] URL changed to: ', state);
            chrome.tabs.sendMessage(tabId, {
                type: 'BetterBuff_URL_CHANGED',
                state
            });
        }
    });
});
