<script lang="ts">
	import SettingCheckbox from "../components/SettingCheckbox.svelte";
	import SettingMultiChoice from "../components/SettingMultiChoice.svelte";
	import Background from "../icons/magicpattern-grid.png";
</script>

<div class="flex flex-col justify-center items-center gap-2 h-full w-full mx-8 z-10">
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<SettingCheckbox text="Use Dark Mode" checked={true} storageKey="darkMode" />
    <SettingMultiChoice text="Listing Options" />
</div>
<!-- <img src={Background} alt="Background" class="absolute top-30 left-0 bg-cover h-[400px] w-[571px] object-cover" /> -->
