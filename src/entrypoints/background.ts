import type { BetterBuff } from '@/lib/@types/BetterBuff';
import buffItems from '@/assets/buff-ids.json'; // TODO: Check if having a Map of number to string is faster than this object string -> string
import buffSkins from '@/assets/buff-skins-sorted.json';
import buffStickers from '@/assets/buff-stickers-sorted.json';
import buffOthers from '@/assets/buff-others-sorted.json';
import { browser } from 'wxt/browser';
import { defineBackground } from 'wxt/sandbox';
import { findBestMatches, getMatchedItemName } from '@/lib/util/itemSuggestion';

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
                hash: url.hash,
            };
            console.log('[BetterBuff] URL changed to: ', state);
            browser.tabs.sendMessage(tabId, {
                type: 'BetterBuff_URL_CHANGED',
                state,
            });
        }
    });

    browser.omnibox.onInputStarted.addListener(() => {
        browser.omnibox.setDefaultSuggestion({ description: 'Type the name of any CS item on Buff' });

        // TODO: Remove Benchmarks
        let benchmark = (str: string) => {
            console.warn(`BENCHMARK: "${str}"`);
            const bestMatches = findBestMatches(10, str, buffSkins, buffStickers, buffOthers);
            console.log('Suggestions:', bestMatches.map(({ element, score }) => ({
                item: buffItems[element as keyof typeof buffItems],
                score,
            })));
            console.log('===========================================================================================================================');
        };

        benchmark('karambit');
        benchmark('some item name that does not exist');
        benchmark('ak neon ride');
        benchmark('ak neon rider');
        benchmark('ak neon rider fac');
        benchmark('100thieves');
        benchmark('chanticos');
        benchmark('chanticos fire m4');
        benchmark('stat trak awp neo noir field tested');
    });

    browser.omnibox.onInputChanged.addListener((text, suggest) => {
        console.warn(`BENCHMARK: "${text}"`);

        const suggestions = [];

        const bestMatches = findBestMatches(10, text, buffSkins, buffStickers, buffOthers);

        console.log('Suggestions:', bestMatches.map(({ element, score }) => ({
            item: buffItems[element as keyof typeof buffItems],
            score,
        })));

        if (bestMatches.length === 0) {
            throw Error(`No suggestions matched for search term "${text}".`);
        }

        const bestMatchScore = bestMatches[0].score;

        for (const topNElement of bestMatches) {
            if (topNElement.score < bestMatchScore / 2) {
                // abort here to not show any hallucinated edit-distance suggestions
                // maybe consider: https://stackoverflow.com/a/32337766/6920681
                break;
            }

            const buffId = topNElement.element;
            const itemName = buffItems[buffId as keyof typeof buffItems];

            const url = `https://buff.163.com/goods/${buffId}`;
            // TODO: construct the matching indices during ranking
            const description = `${getMatchedItemName(itemName, text.toLowerCase().split(' ').map(k => k.trim()).filter(k => k.length > 0))} - <url>${url}</url>`;

            suggestions.push({
                deletable: false,
                description: description,
                content: url,
            });
        }

        console.log('===========================================================================================================================');

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
