import { activateHandler } from "@/lib/util/eventListeners";
import './style.css';
import { activateURLHandler } from "@/lib/util/urlListener";

export default defineContentScript({
    matches: ["*://*.buff.163.com/*"],
    runAt: 'document_end',
    main(ctx) {
        activateHandler();

        applyStaticAdjustments();

        activateURLHandler();
    }
});

function applyStaticAdjustments() {
    // apply dark mode
    document.body.classList.add('bb-dark-mode');
}