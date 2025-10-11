<script lang="ts">
import * as Tooltip from '$lib/components/ui/tooltip';
import { ExtensionStorage, type IStorage } from '../util/storage';
import {
	MageBox3d,
	MaterialSymbolsDetails,
	MaterialSymbolsFrameInspect,
	MaterialSymbolsHelpRounded,
	MaterialSymbolsSearch,
	MdiDatabaseSearchOutline,
	PhGlobe,
	PhLinkSimple,
	RiFileCopy2Line,
} from './icons';
import Checkbox from './ui/checkbox/checkbox.svelte';
import Label from './ui/label/label.svelte';

let { dataTip }: { dataTip: string } = $props();

const choices: { [K in keyof IStorage['listingOptions']]: { label: string; icon: any } } = {
	'3dinspect': { label: '3D Inspect', icon: MageBox3d },
	inspectIngame: { label: 'Inspect in game', icon: MaterialSymbolsFrameInspect },
	inspectServer: { label: 'Inspect in Server', icon: PhGlobe },
	copyGen: { label: 'Copy !gen/!gengl', icon: RiFileCopy2Line },
	share: { label: 'Share', icon: PhLinkSimple },
	matchFloat: { label: 'Match floatDB', icon: MdiDatabaseSearchOutline },
	findSimilar: { label: 'Find Similar', icon: MaterialSymbolsSearch },
	detail: { label: 'Detail', icon: MaterialSymbolsDetails },
};

const storage = ExtensionStorage.listingOptions;
let values = $state<Partial<IStorage['listingOptions']>>({});

$effect(() => {
	storage.getValue().then(v => values = v);
});

const storeValue = async (choice: keyof IStorage['listingOptions']) => {
	values[choice] = !values[choice];

	await storage.setValue(values as IStorage['listingOptions']);
};

const notypecheck = (x: string) => x as keyof IStorage['listingOptions'];
</script>

<div class="w-full mx-4 border border-base-300 bg-card/90 rounded-lg py-2 px-3">
	<div class="flex items-center gap-2 mt-1 mx-1">
		<Label class="text-sm font-medium">Listing Options</Label>
		<Tooltip.Root>
			<Tooltip.Trigger>
				<MaterialSymbolsHelpRounded class="size-5 text-neutral-300 hover:text-neutral-100" />
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>{dataTip}</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</div>

	<ul class="mx-2 gap-2">
		{#each Object.entries(choices) as [choice, choiceValue]}
			{@const Icon = choiceValue.icon}
			<div class="flex justify-between mx-2 my-2">
				<div class="flex items-center gap-2">
					<Icon class="size-5 text-neutral-500" />
					<Label for={choice} class="text-sm font-normal">{choiceValue.label}</Label>
				</div>
				<Checkbox id={choice} name={choiceValue.label} size="sm" value={choice} bind:checked={values[notypecheck(choice)]} on:click={() => storeValue(notypecheck(choice))} />
			</div>
		{/each}
	</ul>
</div>
