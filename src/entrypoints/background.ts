import type { BetterBuff } from '@/lib/@types/BetterBuff';
import buffItemsSorted from '@/assets/buff-items-sorted.json';
import { browser } from 'wxt/browser';
import { defineBackground } from 'wxt/sandbox';

export default defineBackground(() => {
    const buffItems: BetterBuff.BuffItemEntry = buffItemsSorted;

    browser.runtime.onInstalled.addListener(() => {
        console.log('Extension installed, version: ', browser.runtime.getManifest().version);
    });

    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (tab.url?.startsWith('https://buff.163.com') && changeInfo.status === 'complete') {
            const url = new URL(tab.url);
            const state: BetterBuff.URLState = {
                path: url.pathname,
                search: url.search,
                hash: url.hash
            };
            console.log('[BetterBuff] URL changed to: ', state);
            browser.tabs.sendMessage(tabId, {
                type: 'BetterBuff_URL_CHANGED',
                state
            });
        }
    });

    browser.omnibox.onInputChanged.addListener((text, suggest) => {
        const keywords = text.toLowerCase().split(' ');
        const suggestions = [];

        for (const buffItem of Object.keys(buffItems)) {
            if (keywords.every(k => buffItem.toLowerCase().includes(k))) {
                suggestions.push({
                    deletable: false,
                    description: buffItem,
                    content: `https://buff.163.com/goods/${buffItems[buffItem]}`,
                });

                if (suggestions.length > 5) {
                    break;
                }
            }
        }

        suggest(suggestions);
    });

    browser.omnibox.onInputEntered.addListener((text, disposition) => {
        switch (disposition) {
            case 'currentTab':
                browser.tabs.update({ url: text });
                break;
            case 'newBackgroundTab':
                browser.tabs.create({ url: text, active: false });
                break;
            case 'newForegroundTab':
                browser.tabs.create({ url: text, active: true });
                break;
        }
    });
});
