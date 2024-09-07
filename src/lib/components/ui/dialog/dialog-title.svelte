<script lang="ts">
import { cn } from '$lib/utils.js';
import type { Dialog as DialogPrimitive } from 'bits-ui';

type $$Props = DialogPrimitive.TitleProps;

const className: $$Props['class'] = undefined;
export { className as class };
</script>

<DialogPrimitive.Title
	class={cn("text-lg font-semibold leading-none tracking-tight text-white", className)}
	{...$$restProps}
>
	<slot />
</DialogPrimitive.Title>
