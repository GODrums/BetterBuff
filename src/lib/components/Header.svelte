<script lang="ts">
    const version = browser.runtime.getManifest().version;
</script>
<div class="container flex justify-center items-center py-6 z-10">
    <!-- <img alt="BetterBuff Logo" style="filter: brightness(0) saturate(100%) invert(71%) sepia(0%) saturate(21%) hue-rotate(181deg) brightness(109%) contrast(89%);"/> -->
    <h1 class="text-3xl font-extrabold">BetterBuff</h1>
    <span class="badge badge-md badge-ghost ml-3 -translate-y-2">v. {version}</span>
</div>