<script lang="ts">
import { cn } from '$lib/utils.js';
import type { Dialog as DialogPrimitive } from 'bits-ui';

type $$Props = DialogPrimitive.DescriptionProps;

const className: $$Props['class'] = undefined;
export { className as class };
</script>

<DialogPrimitive.Description
	class={cn("text-sm text-muted-foreground", className)}
	{...$$restProps}
>
	<slot />
</DialogPrimitive.Description>
