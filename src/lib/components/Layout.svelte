<script lang="ts">
	import Footer from "./Footer.svelte";
	import Header from "./Header.svelte";
</script>

<div class="container w-[380px] h-[580px]">
	<div class="magicpattern">
		<Header />
		<slot />
		<Footer />
	</div>
</div>
