<script lang="ts">
import { Checkbox as CheckboxPrimitive } from 'bits-ui';
import Check from 'svelte-radix/Check.svelte';
import Minus from 'svelte-radix/Minus.svelte';
import { cn } from '$lib/utils.js';
import { type CheckboxProps } from './index.js';

type $$Props = CheckboxProps;
type $$Events = CheckboxPrimitive.Events;

let className: $$Props['class'] = undefined;
export let size: $$Props['size'] = 'default';
export let checked: $$Props['checked'] = false;
export { className as class };
</script>

<CheckboxPrimitive.Root
	class={cn(
		"peer box-content shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[disabled=true]:cursor-not-allowed data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[disabled=true]:opacity-50",
		size === "sm" ? "size-5" : "size-6",
		className
	)}
	bind:checked
	on:click
	{...$$restProps}
>
	<CheckboxPrimitive.Indicator
		class={cn("flex items-center justify-center text-current",
		size === "sm" ? "size-5" : "size-6")}
		let:isChecked
		let:isIndeterminate
	>
		{#if isIndeterminate}
			<Minus class={size === "sm" ? "size-4" : "size-5"} />
		{:else}
			<Check class={cn(size === "sm" ? "size-4" : "size-5", !isChecked && "text-transparent")} />
		{/if}
	</CheckboxPrimitive.Indicator>
</CheckboxPrimitive.Root>
