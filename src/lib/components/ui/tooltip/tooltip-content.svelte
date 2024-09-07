<script lang="ts">
import { cn, flyAndScale } from '$lib/utils.js';
import type { Tooltip as TooltipPrimitive } from 'bits-ui';

type $$Props = TooltipPrimitive.ContentProps;

const className: $$Props['class'] = undefined;
export const sideOffset: $$Props['sideOffset'] = 4;
export const transition: $$Props['transition'] = flyAndScale;
export const transitionConfig: $$Props['transitionConfig'] = {
	y: 8,
	duration: 150,
};
export { className as class };
</script>

<TooltipPrimitive.Content
	{transition}
	{transitionConfig}
	{sideOffset}
	class={cn(
		"z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground",
		className
	)}
	{...$$restProps}
>
	<slot />
</TooltipPrimitive.Content>
