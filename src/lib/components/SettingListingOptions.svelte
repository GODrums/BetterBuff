<script lang="ts">
    import type { WxtStorageItem } from "wxt/storage";
    import Tooltip from "./Tooltip.svelte";
    import { onMount } from "svelte";
    import { ExtensionStorage, type IStorage } from "../util/storage";

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

<div class="form-control w-full mx-4 border border-base-300 bg-[#09090b]/90 rounded-lg py-2 px-3">
	<div class="inline-flex gap-2 mt-1">
		<span class="label-text text-primary">{text}</span>
		<Tooltip {dataTip} tooltipClass="tooltip-primary" svgClass="text-info hover:text-base-100" />
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
