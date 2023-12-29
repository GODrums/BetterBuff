<script lang="ts">
    import { onMount } from "svelte";
	import SettingCheckbox from "../components/SettingCheckbox.svelte";
	import SettingMultiChoice from "../components/SettingMultiChoice.svelte";
    import {ExtensionStorage } from "../util/storage";
</script>

<div class="flex flex-col justify-center items-center gap-2 h-full w-full mx-8 z-10">
	<SettingCheckbox text="Use Dark Mode" storage={ExtensionStorage.enabled} />
    <SettingMultiChoice text="Listing Options" />
</div>
