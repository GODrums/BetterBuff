<script lang="ts">
    import { onMount } from 'svelte';
    import type { WxtStorageItem } from 'wxt/storage';

    export let text: string;
    export let storage: WxtStorageItem<boolean, {}>;

    $: checked = false;

    const storeValue = async () => {
        checked = !checked;
        await storage.setValue(checked);
    };

    onMount(async () => {
        checked = await storage.getValue();
    });
</script>

    <div class="form-control w-full mx-4 border border-base-300 bg-[#09090b]/90 rounded-lg py-1 px-3">
        <label class="label items-center justify-between cursor-pointer">
            <span class="label-text text-primary">{text}</span>
            <input type="checkbox" class="toggle toggle-info" {checked} on:click={storeValue} />
        </label>
    </div>
