import './buff.content/style.css';
import './buff.content/layout-fix.css';

export default defineContentScript({
	matches: ['*://*.buff.163.com/*'],
	runAt: 'document_start',
	main(_ctx) {
		injectScript();
	},
});

// inject script into page
function injectScript() {
	const script = document.createElement('script');
	script.src = browser.runtime.getURL('/inject.js');
	script.onload = function () {
		(this as HTMLScriptElement).remove();
	};
	(document.head || document.documentElement).appendChild(script);
}
