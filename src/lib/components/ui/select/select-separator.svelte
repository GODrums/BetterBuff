<script lang="ts">
import { cn } from '$lib/utils.js';
import type { Select as SelectPrimitive } from 'bits-ui';

type $$Props = SelectPrimitive.SeparatorProps;

const className: $$Props['class'] = undefined;
export { className as class };
</script>

<SelectPrimitive.Separator class={cn("-mx-1 my-1 h-px bg-muted", className)} {...$$restProps} />
