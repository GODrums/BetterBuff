import type { BetterBuff } from '$lib/@types/BetterBuff';

export default defineBackground(() => {
	browser.runtime.onInstalled.addListener(() => {
		console.log('Extension installed, version: ', browser.runtime.getManifest().version);
	});

	browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
		const url = new URL(tab.url || '');
		if (url.hostname === 'buff.163.com' && changeInfo.status === 'complete') {
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
});
