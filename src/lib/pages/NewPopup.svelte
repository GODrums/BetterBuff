<script lang="ts">
    import Header from '$lib/components/Header.svelte';
    import { ArcticonsPriceconverter, MaterialSymbolsInfoOutline, MaterialSymbolsSettings } from '$lib/components/icons';
    import { ExtensionStorage } from '../util/storage';
    import BBlogo from '/icon/512.png';
    import BUlogo from '$lib/icons/bu-logo.png';
    import * as Tabs from '$lib/components/ui/tabs/index.js';
    import { Button } from '$lib/components/ui/button';
    import SettingPaymentMethods from '$lib/components/SettingPaymentMethods.svelte';
    import SettingCheckbox from '$lib/components/SettingCheckbox.svelte';
    import ListingDifference from '../components/ListingDifference.svelte';
    import SettingListingOptions from '../components/SettingListingOptions.svelte';
    import { ScrollArea } from '$lib/components/ui/scroll-area';

    let m = { x: 0, y: 0 };

    function handleMousemove(event: any) {
        m.x = event.clientX;
        m.y = event.clientY;
    }
</script>

<div class="dark flex flex-col bg-card text-card-foreground justify-between h-[600px] w-[350px] overflow-hidden heroBG" on:mousemove={handleMousemove} role="document">
    <div class="absolute inset-0 pointer-events-none maskBG" style="mask-image: radial-gradient(100px at {m.x}px {m.y}px, black 0%, transparent 100%);" />
    <Header />
    <Tabs.Root value="settings" class="h-full">
        <Tabs.Content value="settings">
            <ScrollArea class="h-[488px] rounded-md">
                <SettingPaymentMethods />
                <SettingCheckbox text="Show Big Previews" storage={ExtensionStorage.showBigPreviews} dataTip="Show large item screenshots on image hover." />
                <SettingCheckbox text="Hide Floating Bar" storage={ExtensionStorage.hideFloatBar} dataTip="Hide the floating bar on the right site." />
                <SettingCheckbox text="Fix Website Layout" storage={ExtensionStorage.layoutFix} dataTip="Fixes the Buff website's layout for vertical/smaller displays." />
                <SettingCheckbox
                    text="Data Protection"
                    storage={ExtensionStorage.dataProtection}
                    dataTip="Blur privacy-relevant data in your account settings page. Relevant if you are screen-sharing or streaming." />
                <SettingListingOptions dataTip="Actions displayed under each listing on the corresponding item page. Requires a page reload." />
            </ScrollArea>
        </Tabs.Content>
        <Tabs.Content value="pricing">
            <ScrollArea class="h-[488px] rounded-md">
                <ListingDifference />
            </ScrollArea>
        </Tabs.Content>
        <Tabs.Content value="about">
            <ScrollArea class="h-[488px] rounded-md">
                <div class="flex flex-col items-center">
                    <div class="flex items-center justify-center gap-2 pb-2">
                        <p class="scroll-m-20 text-sm font-medium text-gray-600">based on</p>
                        <Button variant="ghost" class="py-1 px-2 h-7" on:click={() => window.open('https://github.com/PenguiniVogel/BuffUtility')}>
                            <img class="h-6" src={BUlogo} alt="BuffUtility" />
                        </Button>
                    </div>
                    <div class="relative">
                        <img class="h-12" src={BBlogo} alt="BetterBuff" />
                    </div>
                    <h3 class="scroll-m-20 text-2xl font-bold tracking-tight">BetterBuff</h3>
                </div>
            </ScrollArea>
        </Tabs.Content>
        <div class="relative z-10 bg-card/90">
            <Tabs.List class="grid w-full grid-cols-3 border-t border-muted">
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
        </div>
    </Tabs.Root>
</div>

<style>
    .heroBG {
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='14' height='14' fill='none'%3e%3ccircle fill='%23262626' id='pattern-circle' cx='10' cy='10' r='2.5'%3e%3c/circle%3e%3c/svg%3e");
    }

    .maskBG {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='14' height='14' fill='none'%3E%3Ccircle fill='%236366f1' id='pattern-circle' cx='10' cy='10' r='2.5'%3E%3C/circle%3E%3C/svg%3E");
    }
</style>
