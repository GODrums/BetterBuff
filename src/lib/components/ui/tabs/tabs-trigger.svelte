<script lang="ts">
import { Tabs as TabsPrimitive } from 'bits-ui';
import { cn } from '$lib/utils.js';

type $$Props = TabsPrimitive.TriggerProps;
type $$Events = TabsPrimitive.TriggerEvents;

let className: $$Props['class'] = undefined;
export let value: $$Props['value'];
export { className as class };
</script>

<TabsPrimitive.Trigger
	class={cn(
		"inline-flex flex-col items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-neutral-900/50 data-[state=active]:text-foreground data-[state=active]:shadow",
		className
	)}
	{value}
	{...$$restProps}
	on:click
	on:keydown
	on:focus
>
	<slot />
</TabsPrimitive.Trigger>
