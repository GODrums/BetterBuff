<script lang="ts">
import DiscordIcon from '../icons/discord.svg';
import SteamIcon from '../icons/steam.svg';
import TwitterIcon from '../icons/twitter.svg';
import NavLink from './NavLink.svelte';
</script>

<footer class="footer footer-center bg-transparent text-base-content rounded mb-1 mt-4">
	<nav class="grid grid-flow-col grid-cols-2 grid-rows-1 gap-4">
        <NavLink src={DiscordIcon} link="https://discord.gg/VQWXp33nSW" />
        <NavLink src={TwitterIcon} link="https://twitter.com/rumscsgo" />
        <NavLink src={SteamIcon} link="https://steamcommunity.com/id/rums" />
    </nav>
</footer>
