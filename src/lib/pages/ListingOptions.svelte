<script lang="ts">
import '../components/style.css';
import floatLogo from '../icons/float-logo.png';

let data = JSON.parse(document.querySelector('#betterbuff-listing-anchor')?.getAttribute('data-betterbuff') ?? '{}');
const shareLink = data.share ?? location.href;

function copyToClipboard(text: string) {
	navigator?.clipboard?.writeText(text).then(() => {
		console.debug(`[BetterBuff] Copied to clipboard: ${text}`);
	});
	window.postMessage({ type: 'toast', text: 'Copied to clipboard', success: true });
}
</script>

<div class="flex items-center gap-3 pb-4">
    <div class="tooltip tooltip-right" data-tip={data.gen}>
        <button class="btn btn-ghost bg-[#2E3135]" on:click={() => copyToClipboard(data.gen)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                ><path fill="#888888" d="M9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm-4 4q-.825 0-1.412-.587T3 20V6h2v14h11v2z" /></svg>
            Copy !gen
        </button>
    </div>
    <a class="btn btn-ghost bg-[#2E3135]" href={data.matchFloat} target="_blank">
        <img src={floatLogo} class="w-5 h-5 rounded-md" alt="FloatDB Logo" />
        Match FloatDB
    </a>
    <div class="tooltip" data-tip={shareLink}>
        <button class="btn btn-ghost bg-[#2E3135]" on:click={() => copyToClipboard(shareLink)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                ><path
                    fill="#888888"
                    d="M6 23q-.825 0-1.412-.587T4 21V10q0-.825.588-1.412T6 8h3v2H6v11h12V10h-3V8h3q.825 0 1.413.588T20 10v11q0 .825-.587 1.413T18 23zm5-7V4.825l-1.6 1.6L8 5l4-4l4 4l-1.4 1.425l-1.6-1.6V16z" /></svg>
            Share
        </button>
    </div>
</div>
