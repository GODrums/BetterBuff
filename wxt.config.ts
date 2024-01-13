import { defineConfig } from 'wxt';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  manifest: {
    name: 'BetterBuff',
    description: 'Enhance your website experience on Buff163',
    version: '0.2.1',
    host_permissions: ["*://*.buff.163.com/*"],
    "permissions": ["storage"],
    web_accessible_resources: [{
      resources: ["inject.js"],
      matches: ["*://*.buff.163.com/*"]
    }],
  },
  vite: () => ({
    plugins: [
      svelte({
        // Using a svelte.config.js file causes a segmentation fault when importing the file
        configFile: false,
        preprocess: [vitePreprocess()],
      }),
    ],
  }),
  runner: {
    disabled: true,
  }
});
