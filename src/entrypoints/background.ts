import type { BetterBuff } from '@/lib/@types/BetterBuff';
import buffItems from '@/assets/buff-ids.json'; // TODO: Check if having a Map of number to string is faster than this object string -> string
import buffSkins from '@/assets/buff-skins-sorted.json';
import buffStickers from '@/assets/buff-stickers-sorted.json';
import buffOthers from '@/assets/buff-others-sorted.json';
import { browser } from 'wxt/browser';
import { defineBackground } from 'wxt/sandbox';
import { findBestMatches, getMatchedItemName } from '@/lib/util/itemNameSearch';

export default defineBackground(() => {
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

    browser.omnibox.onInputStarted.addListener(() => {
        browser.omnibox.setDefaultSuggestion({ description: 'Type the name of any CS item on Buff' });
    });

    browser.omnibox.onInputChanged.addListener((text, suggest) => {
        console.time('omnibox search');

        let keywords = text.toLowerCase()
            .split(' ')
            .map(k => k.trim())
            .filter(k => k.length > 0);
        const suggestions = [];

        if (keywords.length > 64) {
            console.warn('[omnibox search] only the first 64 keywords will be considered for suggestions');
            keywords = keywords.splice(64, keywords.length - 64);
        }

        const bestMatches = findBestMatches(10, keywords, buffSkins, buffStickers, buffOthers);

        console.log('search results:', bestMatches.map(({ element, score }) => ({
            item: buffItems[element as keyof typeof buffItems],
            score,
        })));

        for (const topNElement of bestMatches) {
            const buffId = topNElement.element;
            const itemName = buffItems[buffId as keyof typeof buffItems];

            const url = `https://buff.163.com/goods/${buffId}`;
            // TODO: construct the matching indices during ranking
            const description = `${getMatchedItemName(itemName, keywords)} - <url>${url}</url>`;

            suggestions.push({
                deletable: false,
                description: description,
                content: url,
            });
        }

        console.timeEnd('omnibox search');

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
