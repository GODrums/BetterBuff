<script lang="ts">
import { openLink } from '../util/svelteUtil';

let { src, link, imgStyle }: { src: string; link: string; imgStyle?: string } = $props();
</script>
<button class="btn-ghost rounded-full" onclick={() => openLink(link)}>
    <img {src} alt="Social Link" class={imgStyle} />
</button>