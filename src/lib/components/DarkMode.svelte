<script lang="ts">
import { onMount } from 'svelte';
import MoonIcon from '../icons/moon.svg';
import SunIcon from '../icons/sun.svg';
import { ExtensionStorage } from '../util/storage';
import Badge from './ui/badge/badge.svelte';
import Button from './ui/button/button.svelte';

let darkMode = $state(true);

onMount(async () => {
	darkMode = await ExtensionStorage.darkMode.getValue();
});

const toggle = async () => {
	darkMode = !darkMode;
	await ExtensionStorage.darkMode.setValue(darkMode);
};
</script>

<div class="flex items-center gap-2">
	<Button variant="ghost" class="flex items-center h-14 w-28 gap-2" onclick={toggle}>
		<img src={darkMode ? MoonIcon : SunIcon} class="h-12" alt="Dark Mode Icon" />
		<Badge class={darkMode ? "bg-[#00b6ff]" : "bg-[#ffbe00]"}>{darkMode ? "ON" : "OFF"}</Badge>
	</Button>
</div>
