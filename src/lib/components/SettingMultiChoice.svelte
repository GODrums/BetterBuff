<script lang="ts">
	export let text: string;
	export let choices: string[] = ["3D Inspect", "Inspect in Server", "Copy !gen/!gengl", "Share", "Match floatDB", "Find Similar", "Detail"];

	$: iteratedChoices = choices.map((choice, i) => {
		return {
			text: choice,
			checked: false,
			value: choice + i,
		};
	});
</script>

<div class="form-control w-full mx-4 border border-base-300 bg-base-200 rounded-lg py-2 px-3">
	<span class="label-text">{text}</span>
	<ul class="list-none mx-2">
		{#each iteratedChoices as choice}
			<label for={choice.value} class="flex justify-between mx-2 mt-1">
				<span class="label-text">{choice.text}</span>
				<input type="checkbox" id={choice.value} name={choice.text} value={choice.value} />
			</label>
		{/each}
	</ul>
</div>
