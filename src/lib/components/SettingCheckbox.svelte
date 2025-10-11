<script lang="ts">
import type { WxtStorageItem } from '#imports';
import { MaterialSymbolsHelpRounded } from '$lib/components/icons';
import Label from '$lib/components/ui/label/label.svelte';
import * as Tooltip from '$lib/components/ui/tooltip';
import Checkbox from './ui/checkbox/checkbox.svelte';

let { text, storage, dataTip }: { text: string; storage: WxtStorageItem<boolean, {}>; dataTip: string } = $props();

let checked = $state(false);

$effect(() => {
	storage.getValue().then((v) => (checked = v));
});

const storeValue = async () => {
	checked = !checked;
	await storage.setValue(checked);
};
</script>

<div class="w-full border border-base-300 bg-card/90 rounded-lg p-4 z-10">
	<div class="flex items-center justify-between gap-2 space-x-2">
		<div class="flex items-center gap-2">
			<Label class="text-sm font-medium">{text}</Label>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<MaterialSymbolsHelpRounded class="size-5 text-neutral-300 hover:text-neutral-100" />
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>{dataTip}</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
		<Checkbox bind:checked on:click={storeValue} />
	</div>
</div>
