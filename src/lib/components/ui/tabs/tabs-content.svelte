<script lang="ts">
import { cn } from '$lib/utils.js';
import type { Tabs as TabsPrimitive } from 'bits-ui';

type $$Props = TabsPrimitive.ContentProps;

const className: $$Props['class'] = undefined;
export let value: $$Props['value'];
export { className as class };
</script>

<TabsPrimitive.Content
	class={cn(
		"ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 overflow-hidden",
		className
	)}
	{value}
	{...$$restProps}
>
	<slot />
</TabsPrimitive.Content>
