<script lang="ts">
    import BUlogo from "../icons/bu-logo.png";
    import { openLink } from "../util/svelteUtil";
    const version = browser.runtime.getManifest().version;
</script>
<div class="container py-6 z-10">
    <!-- <img alt="BetterBuff Logo" style="filter: brightness(0) saturate(100%) invert(71%) sepia(0%) saturate(21%) hue-rotate(181deg) brightness(109%) contrast(89%);"/> -->
    <div class="flex justify-center items-center ">
        <h1 class="text-3xl font-extrabold">BetterBuff</h1>
        <span class="badge badge-md badge-ghost ml-3 -translate-y-2">v. {version}</span>
    </div>
    <div class="flex justify-center items-center">
        <h3 class="text-sm font-sans">based on</h3>
        <button class="btn btn-ghost rounded-badge w-1/4 py-1 px-2 min-h-7 h-7" on:click={() => openLink('https://github.com/PenguiniVogel/BuffUtility')}>
            <img src={BUlogo} alt="BuffUtility Logo" class=""/>
        </button>
    </div>
</div>