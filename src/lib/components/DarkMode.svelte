<script lang="ts">
import { onMount } from 'svelte';
import MoonIcon from '../icons/moon.svg';
import SunIcon from '../icons/sun.svg';
import { ExtensionStorage } from '../util/storage';
import Badge from './ui/badge/badge.svelte';
import Button from './ui/button/button.svelte';

let darkMode = true;

$: isOn = darkMode;

onMount(async () => {
	darkMode = await ExtensionStorage.darkMode.getValue();
});

const toggle = async () => {
	isOn = !isOn;
	await ExtensionStorage.darkMode.setValue(isOn);
};
</script>

<div class="flex items-center gap-2">
	<Button variant="ghost" class="flex items-center h-14 w-28 gap-2" on:click={toggle}>
		<img src={isOn ? MoonIcon : SunIcon} class="h-12" alt="Dark Mode Icon" />
		<Badge class={isOn ? "bg-[#00b6ff]" : "bg-[#ffbe00]"}>{isOn ? "ON" : "OFF"}</Badge>
	</Button>
</div>
