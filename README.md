<p align="center"><img width="128" height="128" src="./src/public/icon/512.png"><img height="128" src="./media/basedOnBU.png"></p>
<h1 align="center">BetterBuff <font color="gray">- BETA</font></h1>

![GitHub manifest version (path)](https://img.shields.io/chrome-web-store/v/igacjekfbhgjnimlkmpdbgeekddolkaa?label=beta%20version)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/GODrums/betterbuff)
![GitHub repo size](https://img.shields.io/github/repo-size/GODrums/betterbuff)
![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/w/GODrums/betterbuff)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/GODrums/betterbuff/LICENSE)

Based on the original [BuffUtility](https://github.com/PenguiniVogel/BuffUtility) by Penguini, this extension aims to improve the user experience on the chinese site [Buff163](https://buff.163.com/).

<p align="center">
  <a href="https://chromewebstore.google.com/detail/betterfloat/bphfhlfhnohppnleaehnlfigkkccpglk">
    <picture>
      <source srcset="https://i.imgur.com/XBIE9pk.png" media="(prefers-color-scheme: dark)">
      <img height="58" src="https://i.imgur.com/oGxig2F.png" alt="Chrome Web Store"></picture></a>
  <a href="https://addons.mozilla.org/en-US/firefox/addon/betterfloat/">
    <picture>
      <source srcset="https://i.imgur.com/ZluoP7T.png" media="(prefers-color-scheme: dark)">
      <img height="58" src="https://i.imgur.com/4PobQqE.png" alt="Firefox add-ons"></picture></a>
  </br></br>
</p>

## 🤝 Community / Support

<p>
We share the same discord server with my other extension <a href="https://github.com/GODrums/BetterFloat">BetterFloat</a>. Feel free to join us if you have any questions or suggestions:
</p>
<p align="center">
  <a href="https://discord.gg/VQWXp33nSW">
    <picture>
      <source srcset="https://i.postimg.cc/Fzj7T05w/discord.png" media="(prefers-color-scheme: dark)">
      <img height="58" src="https://i.postimg.cc/Fzj7T05w/discord.png" alt="Discord"></picture></a>
</p>

## ⌨️ Development

### 💻 The Tech Stack

<p>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg" title="Svelte" height="35" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" title="TailwindCSS" height="35"/>
  <img src="https://api.iconify.design/logos:daisyui.svg" title="DaisyUI" height="35"/>
  <img src="https://api.iconify.design/vscode-icons:file-type-vite.svg" title="Vite" height="35"/>
  <img src="https://wxt.dev/logo.svg" title="Web Extension Framework (WXT)" height="35"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" title="Typescript" height="35"/>
  <img src="https://api.iconify.design/devicon:pnpm.svg" title="PNPM" height="35"/>
</p>

### 🛠️ Build Instructions

#### 1. Install dependencies

```bash
  pnpm install
  # Setup your local WXT environment
  pnpm postinstall
```

#### 2. Run the extension

-   Run a development command

```bash
  # For chrome
  pnpm dev
  # For firefox
  pnpm dev:firefox
  # Watch mode (Chrome) for HRM
  pnpm watch
```

#### 4. Build the extension

-   Run the build command

```bash
  # Build for chrome
  pnpm build
  # Build for firefox
  pnpm build:firefox
```

-   This will update the `dist` folder in the root directory with the necessary changes
-   It it always recommended to run the `clean` command before building the extension
-   When publishing the extension, a zipped version is required. `scripts/publish.ts` can be used to create a zip file of the `dist` folder

### 5. Miscellaneous

```bash
  # Update all dependencies
  pnpm update
  # Clean the /dist folder
  pnpm clean
  # Check for Svelte errors
  pnpm check
  # Zip the extension for release
  pnpm zip
  pnpm zip:firefox
```

### Contributing

To contribute to this project, create your own fork of the repository and submit a pull request.
Please follow the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) specification (or an equivalent one) and make sure to format your code with [Prettier](https://prettier.io/).

## ⚠️ Disclaimer

BetterBuff is developed independently, and is not officially endorsed by or affiliated with Buff163 (NetEase) in any way. If you are a legal representative of the aforementioned company and would like this project to be taken down, please contact me directly at legal@rums.dev.

Built with 🖤 in Munich.
