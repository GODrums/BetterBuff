<script lang="ts">
    import Tooltip from "./Tooltip.svelte";

	export let text: string;
    export let dataTip: string;
	export let choices: string[] = ["3D Inspect", "Inspect in Server", "Copy !gen/!gengl", "Share", "Match floatDB", "Find Similar", "Detail"];

	$: iteratedChoices = choices.map((choice, i) => {
		return {
			text: choice,
			checked: false,
			value: choice + i,
		};
	});
</script>

<div class="form-control w-full mx-4 border border-base-300 bg-[#09090b]/90 rounded-lg py-2 px-3">
	<div class="inline-flex gap-2">
		<span class="label-text text-primary">{text}</span>
		<Tooltip {dataTip} tooltipClass="tooltip-info" svgClass="text-info hover:text-base-100" />
	</div>
	<ul class="list-none mx-2">
		{#each iteratedChoices as choice}
			<label for={choice.value} class="flex justify-between mx-2 mt-1">
				<span class="label-text text-primary">{choice.text}</span>
				<input type="checkbox" class="toggle" id={choice.value} name={choice.text} value={choice.value} />
			</label>
		{/each}
	</ul>
</div>
