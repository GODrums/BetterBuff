import { adjustTooltip } from '$lib/util/Adjust_Tooltip';
import { initializeStaticRates, loadCurrencySettings, loadRates } from '$lib/util/currencyHelper';
import { activateHandler } from '$lib/util/eventListeners';
import { ExtensionStorage, setBuffCrx } from '$lib/util/storage';
import { activateURLHandler } from '$lib/util/urlListener';

export default defineContentScript({
	cssInjectionMode: 'ui',
	matches: ['*://*.buff.163.com/*'],
	runAt: 'document_end',
	async main(ctx) {
		initContentScript(await ExtensionStorage.enabled.getValue(), ctx);

		ExtensionStorage.enabled.watch((enabled) => {
			initContentScript(enabled, ctx);
		});
	},
});

function initContentScript(enabled: boolean | null, ctx: InstanceType<typeof ContentScriptContext>) {
	if (!enabled) {
		console.debug('[BetterBuff] Extension is disabled, not running.');
		return;
	}
	console.debug('[BetterBuff] Initializing content script...');

	initializeStaticRates();
	activateHandler();
	activateURLHandler();
	addStorageListeners();
	addMutationObserver();

	setTimeout(async () => {
		await loadCurrencySettings();
		await loadRates();
		await applyStaticAdjustments();
		setBuffCrx(ctx);
	}, 50);
}

function addStorageListeners() {
	ExtensionStorage.darkMode.watch((value) => {
		applyDarkMode(value ?? false);
	});
	ExtensionStorage.hideFloatBar.watch((value) => {
		hideFloatBar(value ?? false);
	});
	ExtensionStorage.layoutFix.watch((value) => {
		applyLayoutFix(value ?? false);
	});
	ExtensionStorage.currencyConversionEnabled.watch(() => {
		loadCurrencySettings();
	});
	ExtensionStorage.selectedCurrency.watch(() => {
		loadCurrencySettings();
	});
}

function addMutationObserver() {
	const observer = new MutationObserver((mutations) => {
		const url = new URL(location.href);
		for (const mutation of mutations) {
			for (let i = 0; i < mutation.addedNodes.length; i++) {
				const node = mutation.addedNodes[i];
				if (node instanceof HTMLElement && node.className === 'tooltip-hover' && url.pathname === '/market/csgo') {
					adjustTooltip(node);
				}
			}
		}
	});

	observer.observe(document.body, {
		attributes: false,
		childList: true,
		subtree: false,
	});
}

async function applyStaticAdjustments() {
	// apply dark mode
	if (await ExtensionStorage.darkMode.getValue()) {
		applyDarkMode(true);
	}

	if (await ExtensionStorage.hideFloatBar.getValue()) {
		hideFloatBar(true);
	}

	// apply layout fix
	if (await ExtensionStorage.layoutFix.getValue()) {
		applyLayoutFix(true);
	}
}

function applyDarkMode(darkMode: boolean) {
	document.body.classList.toggle('bb-dark-mode', darkMode);
}

function hideFloatBar(hide: boolean) {
	document.querySelector('.floatbar')?.setAttribute('style', hide ? 'display: none;' : '');
}

function applyLayoutFix(layoutFix: boolean) {
	document.body.classList.toggle('bb-layout-fix', layoutFix);
}
