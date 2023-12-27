import { activateHandler } from "@/lib/util/eventListeners";
import './style.css';

export default defineContentScript({
    matches: ["*://*.buff.163.com/*"],
    runAt: 'document_end',
    main(ctx) {
        console.log('[BetterBuff] Welcome from content script!');
        activateHandler();

        applyDarkmode();
    }
});

function applyDarkmode() {
    document.body.classList.add('bb-dark-mode');
}