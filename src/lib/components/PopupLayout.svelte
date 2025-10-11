<script lang="ts">
import type { Snippet } from 'svelte';
import Header from './Header.svelte';

let m = $state({ x: 0, y: 0 });

function handleMousemove(event: MouseEvent) {
	m.x = event.clientX;
	m.y = event.clientY;
}

let { children }: { children: Snippet } = $props();
</script>

<div class="dark flex flex-col bg-card text-card-foreground justify-between h-[600px] w-[350px] overflow-hidden heroBG" onmousemove={handleMousemove} role="document">
	<div class="absolute inset-0 pointer-events-none maskBG" style="mask-image: radial-gradient(100px at {m.x}px {m.y}px, black 0%, transparent 100%);"></div>
	<Header />
	{@render children()}
</div>

<style>
	.heroBG {
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='14' height='14' fill='none'%3e%3ccircle fill='%23262626' id='pattern-circle' cx='10' cy='10' r='2.5'%3e%3c/circle%3e%3c/svg%3e");
	}

	.maskBG {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='14' height='14' fill='none'%3E%3Ccircle fill='%236366f1' id='pattern-circle' cx='10' cy='10' r='2.5'%3E%3C/circle%3E%3C/svg%3E");
	}
</style>
