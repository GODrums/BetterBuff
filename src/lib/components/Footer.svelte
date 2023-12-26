<script lang="ts">
	import NavLink from './NavLink.svelte';
    import TwitterIcon from '../icons/twitter.svg';
    import DiscordIcon from '../icons/discord.svg';
    import SteamIcon from '../icons/steam.svg';
</script>

<footer class="footer footer-center bg-transparent text-base-content rounded">
	<nav class="grid grid-flow-col grid-cols-2 grid-rows-1 gap-4">
        <NavLink src={DiscordIcon} link="https://discord.gg/VQWXp33nSW" />
        <NavLink src={TwitterIcon} link="https://twitter.com/rumscsgo" />
        <NavLink src={SteamIcon} link="https://steamcommunity.com/id/rums" />
    </nav>
</footer>
