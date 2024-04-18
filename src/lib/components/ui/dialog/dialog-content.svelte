<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import Cross2 from "svelte-radix/Cross2.svelte";
	import * as Dialog from "./index.js";
	import { cn, flyAndScale } from "$lib/utils.js";

	type $$Props = DialogPrimitive.ContentProps;

	let className: $$Props["class"] = undefined;
	export let transition: $$Props["transition"] = flyAndScale;
	export let transitionConfig: $$Props["transitionConfig"] = {
		duration: 200,
	};
	export { className as class };
</script>

<Dialog.Portal>
	<Dialog.Overlay />
	<DialogPrimitive.Content
		{transition}
		{transitionConfig}
		class={cn(
			"fixed left-[50%] top-[50%] z-50 grid w-[90%] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-neutral-500 bg-neutral-800/80 p-6 shadow-lg rounded-lg md:w-full",
			className
		)}
		{...$$restProps}
	>
		<slot />
		<DialogPrimitive.Close
			class="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
		>
			<Cross2 class="size-5 text-white" />
			<span class="sr-only">Close</span>
		</DialogPrimitive.Close>
	</DialogPrimitive.Content>
</Dialog.Portal>
