<script lang="ts">
    import SettingCheckbox from '../components/SettingCheckbox.svelte';
    import SettingListingOptions from '../components/SettingListingOptions.svelte';
    import { ExtensionStorage } from '../util/storage';
    import Power from '../components/Power.svelte';
    import DarkMode from '../components/DarkMode.svelte';
    import SettingPaymentMethods from '../components/SettingPaymentMethods.svelte';

    let dialog: HTMLDialogElement;
    let showModal: boolean = false;

    $: if (dialog && showModal) dialog.showModal();
</script>

<main class="h-[410px] flex overflow-y-auto overflow-x-hidden">
    <div class="flex flex-col items-center gap-2 h-full w-full mx-8 z-10">
        <div class="flex gap-10">
            <Power />
            <DarkMode />
        </div>
        <SettingPaymentMethods bind:showModal={showModal}/>
        <SettingCheckbox text="Hide floating bar" storage={ExtensionStorage.hideFloatBar} dataTip="Hide the floating bar on the right site." />
        <SettingListingOptions text="Listing Options" dataTip="Actions displayed under each listing on the corresponding item page. Requires a page reload." />
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
    <dialog class="modal" bind:this={dialog} on:close={() => (showModal = false)} on:click|self={() => dialog.close()}>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="modal-box" on:click|stopPropagation>
          <p class="text-sm my-1">Select the payment methods available to you. Listings that do not support at least one of your selected payment methods will be grayed out.</p>
          <p class="text-sm my-1">HINT: If you are using Buff as a foreigner, likely you can only use 'BUFF balance-Alipay'.</p>
          <div class="modal-action m-0">
            <button class="btn mt-2" on:click={() => dialog.close()}>Close</button>
          </div>
        </div>
    </dialog>
</main>
