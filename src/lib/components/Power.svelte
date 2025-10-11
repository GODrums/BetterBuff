<script lang="ts">
import { onMount } from 'svelte';
import PowerOff from '../icons/power-off.svg';
import PowerOn from '../icons/power-on.svg';
import { ExtensionStorage } from '../util/storage';
import Badge from './ui/badge/badge.svelte';
import Button from './ui/button/button.svelte';

let enabled = $state(true);

onMount(async () => {
	enabled = await ExtensionStorage.enabled.getValue();
});

const toggle = async () => {
	enabled = !enabled;
	await ExtensionStorage.enabled.setValue(enabled);
};
</script>

<div class="flex items-center gap-2">
    <Button variant="ghost" class="flex items-center h-14 w-28 gap-2" onclick={toggle}>
        <img src={enabled ? PowerOn : PowerOff} class="h-12" alt="Power Icon" />
        <Badge class={enabled ? 'bg-[#00b6ff]' : 'bg-[#ffbe00]'}>{enabled ? "ON" : "OFF"}</Badge>
    </Button>
</div>