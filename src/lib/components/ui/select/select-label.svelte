<script lang="ts">
import { cn } from '$lib/utils.js';
import type { Select as SelectPrimitive } from 'bits-ui';

type $$Props = SelectPrimitive.LabelProps;

const className: $$Props['class'] = undefined;
export { className as class };
</script>

<SelectPrimitive.Label class={cn("px-2 py-1.5 text-sm font-semibold", className)} {...$$restProps}>
	<slot />
</SelectPrimitive.Label>
