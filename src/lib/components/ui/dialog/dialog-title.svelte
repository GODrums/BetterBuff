<script lang="ts">
import { Dialog as DialogPrimitive } from 'bits-ui';
import { cn } from '$lib/utils.js';

type $$Props = DialogPrimitive.TitleProps;

let className: $$Props['class'] = undefined;
export { className as class };
</script>

<DialogPrimitive.Title
	class={cn("text-lg font-semibold leading-none tracking-tight text-white", className)}
	{...$$restProps}
>
	<slot />
</DialogPrimitive.Title>
