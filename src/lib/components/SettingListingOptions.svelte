<script lang="ts">
    import { onMount } from "svelte";
    import { ExtensionStorage, type IStorage } from "../util/storage";
    import * as Tooltip from '$lib/components/ui/tooltip';
    import { Button } from "./ui/button";
    import { MaterialSymbolsHelpRounded } from "./icons";
    import { Label } from "./ui/label";

	export let text: string;
    export let dataTip: string;
	export let choices: { [K in keyof IStorage["listingOptions"]]: string } = {
		"3dinspect": "3D Inspect", 
		inspectServer: "Inspect in Server", 
		inspectIngame: "Inspect in game",
		copyGen: "Copy !gen/!gengl", 
		share: "Share", 
		matchFloat: "Match floatDB", 
		findSimilar: "Find Similar", 
		detail: "Detail"
	};
    
	let storage = ExtensionStorage.listingOptions;
	let values: Partial<IStorage["listingOptions"]> = {};

    onMount(async () => {
        values = await storage.getValue();
    });

    const storeValue = async (choice: keyof IStorage["listingOptions"]) => {
		values[choice] = !values[choice];

		await storage.setValue(values as IStorage["listingOptions"]);
    };

	const notypecheck = (x:string)=>x as keyof IStorage["listingOptions"];
</script>

<div class="w-full mx-4 border border-base-300 bg-card/90 rounded-lg py-2 px-3">
	<div class="flex items-center gap-2 mt-1 mx-1">
		<Label class="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{text}</Label>
		<Tooltip.Root>
			<Tooltip.Trigger>
				<MaterialSymbolsHelpRounded class="size-4 text-neutral-300 hover:text-neutral-100" />
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>{dataTip}</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</div>
	<ul class="list-none mx-2">
		{#each Object.entries(choices) as [choice, choiceText]}
			<label for={choice} class="flex justify-between mx-2 mt-1">
				<span class="label-text text-primary">{choiceText}</span>
				<input type="checkbox" class="toggle toggle-info" id={choice} name={choiceText} value={choice} checked={values[notypecheck(choice)]} on:click={() => storeValue(notypecheck(choice))}>
			</label>
		{/each}
	</ul>
</div>
