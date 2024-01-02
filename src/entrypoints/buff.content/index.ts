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

        setTimeout(async () => {
            await applyStaticAdjustments();
        }, 50);
    }
});

async function applyStaticAdjustments() {
    // apply dark mode
    if (await ExtensionStorage.darkMode.getValue()) {
        document.body.classList.add('bb-dark-mode');
    }
}