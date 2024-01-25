<script lang="ts">
    import { onMount } from "svelte";
    import { ExtensionStorage } from "../util/storage";
    import PowerOn from "../icons/power-on.svg";
    import PowerOff from "../icons/power-off.svg";

    let enabled = true;

    $: isOn = enabled;

    onMount(async () => {
        enabled = await ExtensionStorage.enabled.getValue();
    });
    
    const toggle = async () => {
        isOn = !isOn;
        await ExtensionStorage.enabled.setValue(isOn);
    };
</script>

<label class="swap btn btn-ghost py-8 my-4">
    <input type="checkbox" checked={isOn} on:click={toggle} />
    <div class="swap-on flex items-center">
        <img src={PowerOn} class="h-12" alt="Power On" />
        <div class="badge badge-info ml-2">ON</div>
    </div>
    <div class="swap-off flex items-center">
        <img src={PowerOff} class="h-12" alt="Power Off" />
        <div class="badge badge-warning ml-2">OFF</div>
    </div>
</label>