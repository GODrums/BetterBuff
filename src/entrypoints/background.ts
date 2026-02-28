import type { BetterBuff } from '$lib/@types/BetterBuff';

export default defineBackground(() => {
	browser.runtime.onInstalled.addListener(() => {
		console.log('Extension installed, version: ', browser.runtime.getManifest().version);
	});

	browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
		if (message?.type === 'BetterBuff_FETCH_RATES') {
			fetch(import.meta.env.WXT_CURRENCY_URL, {
				headers: {
					'Content-Type': 'application/json',
					'X-Via': `BetterBuff/${browser.runtime.getManifest().version}`,
				},
			})
				.then((res) => res.json())
				.then((data) => sendResponse({ success: true, data }))
				.catch((err) => sendResponse({ success: false, error: String(err) }));
			return true; // keep the message channel open for async response
		}
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
