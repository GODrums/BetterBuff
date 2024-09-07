<script lang="ts">
import { cn } from '$lib/utils.js';
import { type Variant, badgeVariants } from './index.js';

const className: string | undefined | null = undefined;
export const href: string | undefined = undefined;
export const variant: Variant = 'default';
export { className as class };
</script>

<svelte:element
	this={href ? "a" : "span"}
	{href}
	class={cn(badgeVariants({ variant, className }))}
	{...$$restProps}
>
	<slot />
</svelte:element>
