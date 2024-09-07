<script lang="ts">
import { onMount } from 'svelte';
import PowerOff from '../icons/power-off.svg';
import PowerOn from '../icons/power-on.svg';
import { ExtensionStorage } from '../util/storage';
import Badge from './ui/badge/badge.svelte';
import Button from './ui/button/button.svelte';

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

<div class="flex items-center gap-2">
    <Button variant="ghost" class="flex items-center h-14 w-28 gap-2" on:click={toggle}>
        <img src={isOn ? PowerOn : PowerOff} class="h-12" alt="Power Icon" />
        <Badge class={isOn ? 'bg-[#00b6ff]' : 'bg-[#ffbe00]'}>{isOn ? "ON" : "OFF"}</Badge>
    </Button>
</div>