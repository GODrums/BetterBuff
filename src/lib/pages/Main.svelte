<script lang="ts">
    import SettingCheckbox from '../components/SettingCheckbox.svelte';
    import SettingListingOptions from '../components/SettingListingOptions.svelte';
    import { ExtensionStorage } from '../util/storage';
    import Power from '../components/Power.svelte';
    import DarkMode from '../components/DarkMode.svelte';
</script>

<main class="h-[410px] flex justify-center overflow-y-scroll">
    <div class="flex flex-col justify-center items-center gap-2 h-full w-full mx-8 z-10">
        <div class="flex gap-10">
            <Power />
            <DarkMode />
        </div>
        <SettingCheckbox text="Hide floating bar" storage={ExtensionStorage.hideFloatBar} dataTip="Hide the floating bar on the right site." />
        <SettingListingOptions text="Listing Options" dataTip="Actions displayed under each listing on the corresponding item page. Requires a page reload." />
    </div>
</main>
