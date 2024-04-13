<script lang="ts">
    import Header from '$lib/components/Header.svelte';
    import { ArcticonsPriceconverter, MaterialSymbolsInfoOutline, MaterialSymbolsSettings } from '$lib/components/icons';
    import BBlogo from '/icon/512.png';
    import BUlogo from '$lib/icons/bu-logo.png';
    import * as Tabs from '$lib/components/ui/tabs/index.js';
    import { Button } from '$lib/components/ui/button';
</script>

<div class="dark flex flex-col bg-card text-card-foreground justify-between h-[600px] w-[430px] overflow-hidden">
    <Header />
    <Tabs.Root value="settings" class="h-full">
        <Tabs.Content value="settings">Test</Tabs.Content>
        <Tabs.Content value="pricing">Test2</Tabs.Content>
        <Tabs.Content value="about">
            <div class="flex flex-col items-center">
                <div class="flex items-center justify-center gap-2 pb-2">
                    <p class="scroll-m-20 text-sm font-medium text-gray-600">based on</p>
                    <Button variant="ghost" class="py-1 px-2 h-7" on:click={() => window.open('https://github.com/PenguiniVogel/BuffUtility')}>
                        <img class="h-6" src={BUlogo} alt="BuffUtility" />
                    </Button>
                </div>
                <img class="w-24 h-24" src={BBlogo} alt="BetterBuff" />
                <h3 class="scroll-m-20 text-2xl font-bold tracking-tight">BetterBuff</h3>
            </div>
        </Tabs.Content>
        <Tabs.List class="grid w-full grid-cols-3">
            <Tabs.Trigger value="settings">
                <MaterialSymbolsSettings class="w-6 h-6" />
                Settings
            </Tabs.Trigger>
            <Tabs.Trigger value="pricing">
                <ArcticonsPriceconverter class="w-6 h-6" />
                Pricing
            </Tabs.Trigger>
            <Tabs.Trigger value="about">
                <MaterialSymbolsInfoOutline class="w-6 h-6" />
                About
            </Tabs.Trigger>
        </Tabs.List>
    </Tabs.Root>
</div>
