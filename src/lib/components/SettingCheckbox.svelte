<script lang="ts">
    export let text: string;
    export let checked: boolean;
    export let storageKey: string;

    const storeValue = () => {
        storage.setItem(storageKey, checked);
    };
</script>

<div class="form-control w-full mx-4 border border-base-300 bg-base-200 rounded-lg py-1 px-3">
    <label class="label items-center justify-between cursor-pointer">
        <span class="label-text">{text}</span>
        <input type="checkbox" class="checkbox" checked={checked} on:click={storeValue} />
    </label>
</div>