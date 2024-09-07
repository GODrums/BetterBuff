<script lang="ts">
import { DISCORD_URL } from '$lib/util/globals';
import { ExtensionStorage } from '../util/storage';

import DarkMode from '$lib/components/DarkMode.svelte';
import Power from '$lib/components/Power.svelte';
import SettingCheckbox from '$lib/components/SettingCheckbox.svelte';
import SettingPaymentMethods from '$lib/components/SettingPaymentMethods.svelte';
import Badge from '$lib/components/ui/badge/badge.svelte';
import Button from '$lib/components/ui/button/button.svelte';
import * as Tabs from '$lib/components/ui/tabs/index.js';
import ListingDifference from './SettingListingDifference.svelte';
import SettingListingOptions from './SettingListingOptions.svelte';

import { ArcticonsPriceconverter, MaterialSymbolsInfoOutline, MaterialSymbolsSettings } from '$lib/components/icons';
import { ScrollArea } from '$lib/components/ui/scroll-area';
import BUlogo from '$lib/icons/bu-logo.png';
import BBlogo from '/icon/512.png';
import JoinDiscord from '/join_discord.png';
import BuyMeACoffee from './icons/BuyMeACoffee.svelte';

const version = browser.runtime.getManifest().version;
</script>

<Tabs.Root value="settings" class="h-full">
    <Tabs.Content value="settings">
        <ScrollArea class="h-[488px] rounded-md">
            <div class="flex gap-10 py-4">
                <Power />
                <DarkMode />
            </div>
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
            <div class="w-full mx-4 border border-base-300 bg-card/90 rounded-lg p-5">
                <p class="text-sm text-center">Currency conversion is already integrated into Buff itself. You can change your display currency in your Buff account settings:</p>
                <Button variant="outline" class="w-full mt-2" on:click={() => window.open('https://buff.163.com/user-center/profile')} title="Open Buff Account Settings">
                    Open Buff Account Settings
                </Button>
            </div>
            <ListingDifference />
        </ScrollArea>
    </Tabs.Content>
    <Tabs.Content value="about">
        <ScrollArea class="h-[488px] rounded-md">
            <div class="flex flex-col items-center">
                <div class="flex justify-center pt-12">
                    <img class="h-20" src={BBlogo} alt="BetterBuff" />
                </div>
                <h1 class="pt-2 text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">BetterBuff</h1>
                <div class="flex flex-col items-center justify-center gap-4 py-2">
                    <div class="flex items-center gap-2">
                        <p class="scroll-m-20 text-sm font-medium text-gray-600">based on</p>
                        <Button variant="ghost" class="py-1 px-2 h-7" on:click={() => window.open('https://github.com/PenguiniVogel/BuffUtility')}>
                            <img class="h-6" src={BUlogo} alt="BuffUtility" />
                        </Button>
                    </div>
                    <Badge variant="secondary" class="border-muted text-base">BETA - Version {version}</Badge>
                    <Button variant="ghost" class="p-0 py-4" on:click={() => window.open(DISCORD_URL)}>
                        <img class="h-10" src={JoinDiscord} alt="Join us on Discord" />
                    </Button>
                </div>
                <footer class="absolute bottom-2 w-full text-center text-xs font-semibold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
                    <a
                      href="https://www.buymeacoffee.com/rums"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-1 rounded-lg border border-gray-900 bg-white/80 px-4 py-1.5 transition-all duration-75 hover:scale-105"
                    >
                      <BuyMeACoffee class="h-6 w-6" />
                      <p class="font-medium text-gray-700">Buy me a coffee</p>
                    </a>
                    <p>
                        Built with 🖤 in Munich by
                        <span class="cursor-pointer text-green-900" on:click={() => window.open('https://github.com/GODrums')} role="link" tabindex="-1">Rums</span>
                    </p>
                </footer>
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
