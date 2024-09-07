<script lang="ts">
import { cn } from '$lib/utils.js';
import { Button as ButtonPrimitive } from 'bits-ui';
import { type Events, type Props, buttonVariants } from './index.js';

type $$Props = Props;
type $$Events = Events;

const className: $$Props['class'] = undefined;
export const variant: $$Props['variant'] = 'default';
export const size: $$Props['size'] = 'default';
export const builders: $$Props['builders'] = [];
export { className as class };
</script>

<ButtonPrimitive.Root
	{builders}
	class={cn(buttonVariants({ variant, size, className }))}
	type="button"
	{...$$restProps}
	on:click
	on:keydown
>
	<slot />
</ButtonPrimitive.Root>
