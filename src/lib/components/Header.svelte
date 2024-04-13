<script lang="ts">
    import { Badge } from '$lib/components/ui/badge';
    import { Button } from '$lib/components/ui/button';
    import { DISCORD_URL, GITHUB_URL } from '$lib/util/globals';
    import BBlogo from '/icon/512.png';

    const version = `v. ${browser.runtime.getManifest().version}`;
</script>

<header class="w-full flex align-middle justify-between px-4 py-1.5 bg-card text-card-foreground border-b border-muted shadow-sm">
    <div class="flex gap-2 align-middle items-center">
        <img class="h-[38px] border border-gray-700 rounded-lg" src={BBlogo} alt="BetterBuff" />
        <Badge class="border-muted uppercase">Beta</Badge>
        <Badge variant="outline" class="border-muted text-muted-foreground">{version}</Badge>
    </div>
    <div class="flex gap-1">
        <Button variant="ghost" size="icon" on:click={() => window.open(DISCORD_URL)} title={DISCORD_URL}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 256 256" {...$$props}>
                <g fill="none">
                    <rect width="256" height="256" fill="#5865f2" rx="60" />
                    <g clip-path="url(#skillIconsDiscord0)">
                        <path
                            fill="#fff"
                            d="M197.308 64.797a164.918 164.918 0 0 0-40.709-12.627a.618.618 0 0 0-.654.31c-1.758 3.126-3.706 7.206-5.069 10.412c-15.373-2.302-30.666-2.302-45.723 0c-1.364-3.278-3.382-7.286-5.148-10.412a.643.643 0 0 0-.655-.31a164.472 164.472 0 0 0-40.709 12.627a.583.583 0 0 0-.268.23c-25.928 38.736-33.03 76.52-29.546 113.836a.685.685 0 0 0 .26.468c17.106 12.563 33.677 20.19 49.94 25.245a.648.648 0 0 0 .702-.23c3.847-5.254 7.276-10.793 10.217-16.618a.633.633 0 0 0-.347-.881c-5.44-2.064-10.619-4.579-15.601-7.436a.642.642 0 0 1-.063-1.064a86.364 86.364 0 0 0 3.098-2.428a.618.618 0 0 1 .646-.088c32.732 14.944 68.167 14.944 100.512 0a.617.617 0 0 1 .655.08a79.613 79.613 0 0 0 3.106 2.436a.642.642 0 0 1-.055 1.064a102.622 102.622 0 0 1-15.609 7.428a.638.638 0 0 0-.339.889a133.075 133.075 0 0 0 10.208 16.61a.636.636 0 0 0 .702.238c16.342-5.055 32.913-12.682 50.02-25.245a.646.646 0 0 0 .26-.46c4.17-43.141-6.985-80.616-29.571-113.836a.506.506 0 0 0-.26-.238M94.834 156.142c-9.855 0-17.975-9.047-17.975-20.158s7.963-20.158 17.975-20.158c10.09 0 18.131 9.127 17.973 20.158c0 11.111-7.962 20.158-17.973 20.158m66.456 0c-9.855 0-17.974-9.047-17.974-20.158s7.962-20.158 17.974-20.158c10.09 0 18.131 9.127 17.974 20.158c0 11.111-7.884 20.158-17.974 20.158" />
                    </g>
                    <defs>
                        <clipPath id="skillIconsDiscord0">
                            <path fill="#fff" d="M28 51h200v154.93H28z" />
                        </clipPath>
                    </defs>
                </g>
            </svg>
        </Button>
        <Button variant="ghost" size="icon" on:click={() => window.open(GITHUB_URL)} title={GITHUB_URL}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"
                ><path
                    fill="white"
                    d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2" /></svg>
        </Button>
    </div>
</header>
