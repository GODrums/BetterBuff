import type { BetterBuff } from '@/lib/@types/BetterBuff';
import buffIds from '@/assets/buff-ids.json'; // TODO: Check if having a Map of number to string is faster than this object string -> string
import buffSkins from '@/assets/buff-skins-sorted.json';
import buffStickers from '@/assets/buff-stickers-sorted.json';
import buffOther from '@/assets/buff-other-sorted.json';
import { browser } from 'wxt/browser';
import { defineBackground } from 'wxt/sandbox';
import { getMatchedItemName } from '@/lib/util/search';

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
        let kt = 0;

        console.time('omnibox search');

        const keywords = text.toLowerCase()
            .split(' ')
            .map(k => k.trim())
            .filter(k => k.length > 0);
        const suggestions = [];

        // TODO:
        //  1. Iterate over buffSkins, buffStickers and buffOther and score each item based on "Match Quality" and
        //     "Match Position"
        //  2. Get the top-N matches in-order
        //  3. Construct a suggestion for each top-N match using the buff-id of the match and the equivalent
        //     case-sensitive item name from buffIds

        // for (const buffItem of Object.keys(buffItems)) {
        //     const s = performance.now();
        //     const match = keywords.every(k => buffItem.toLowerCase().includes(k));
        //     kt += performance.now() - s;
        //
        //     if (match) {
        //         const url = `https://buff.163.com/goods/${buffItems[buffItem as keyof typeof buffItems]}`;
        //         const description = `${getMatchedItemName(buffItem, keywords)} - <url>${url}</url>`;
        //
        //         suggestions.push({
        //             deletable: false,
        //             description: description,
        //             content: url,
        //         });
        //
        //         if (suggestions.length > 5) {
        //             break;
        //         }
        //     }
        // }

        console.timeEnd('omnibox search');
        console.log(`Keyword match time: ${kt}`);

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
