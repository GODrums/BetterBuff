<script lang="ts">
    export let src: string;
    export let link: string;

	function openLink(link: string) {
		browser.tabs.create({ url: link });
	}
</script>
<button class="btn-ghost rounded-full" on:click={() => openLink(link)}>
    <img {src} alt="Social Link" />
</button>