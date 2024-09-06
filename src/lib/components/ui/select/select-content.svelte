<script lang="ts">
import { cn, flyAndScale } from '$lib/utils.js';
import type { Select as SelectPrimitive } from 'bits-ui';
import { scale } from 'svelte/transition';

type $$Props = SelectPrimitive.ContentProps;

const className: $$Props['class'] = undefined;
export const sideOffset: $$Props['sideOffset'] = 4;
export const inTransition: $$Props['inTransition'] = flyAndScale;
export const inTransitionConfig: $$Props['inTransitionConfig'] = undefined;
export const outTransition: $$Props['outTransition'] = scale;
export const outTransitionConfig: $$Props['outTransitionConfig'] = {
	start: 0.95,
	opacity: 0,
	duration: 50,
};
export { className as class };
</script>

<SelectPrimitive.Content
	{inTransition}
	{inTransitionConfig}
	{outTransition}
	{outTransitionConfig}
	{sideOffset}
	class={cn(
		"relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-muted-foreground bg-primary text-popover-foreground shadow-md focus:outline-none",
		className
	)}
	{...$$restProps}
>
	<div class="w-full p-1">
		<slot />
	</div>
</SelectPrimitive.Content>
