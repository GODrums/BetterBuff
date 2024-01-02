import { activateHandler } from "@/lib/util/eventListeners";
import './style.css';
import { activateURLHandler } from "@/lib/util/urlListener";
import { ExtensionStorage } from "@/lib/util/storage";

export default defineContentScript({
    matches: ["*://*.buff.163.com/*"],
    runAt: 'document_end',
    main(ctx) {
        activateHandler();
        activateURLHandler();
        addStorageListeners();

        setTimeout(async () => {
            await applyStaticAdjustments();
        }, 50);
    }
});

function addStorageListeners() {
    ExtensionStorage.darkMode.watch((value) => {
        applyDarkMode(value ?? false);
    });
    ExtensionStorage.hideFloatBar.watch((value) => {
        hideFloatBar(value ?? false);
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
}

function applyDarkMode(darkMode: boolean) {
    document.body.classList.toggle('bb-dark-mode', darkMode);
}

function hideFloatBar(hide: boolean) {
    document.querySelector('.floatbar')?.setAttribute('style', hide ? 'display: none;' : '');
}