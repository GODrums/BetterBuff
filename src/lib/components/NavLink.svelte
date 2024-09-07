<script lang="ts">
import { openLink } from '../util/svelteUtil';

export let src: string;
export let link: string;
export const imgStyle = '';
</script>
<button class="btn-ghost rounded-full" on:click={() => openLink(link)}>
    <img {src} alt="Social Link" class={imgStyle} />
</button>