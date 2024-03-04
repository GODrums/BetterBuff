import { defineConfig, type ConfigEnv, type WxtViteConfig } from 'wxt';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { loadEnv } from 'vite';
import type { Manifest } from 'wxt/browser';

const releaseVersion = '0.7.5';

const getViteConfig: ((env: ConfigEnv) => WxtViteConfig | Promise<WxtViteConfig>) = (env) => {
  process.env = {...process.env, ...loadEnv(env.mode, process.cwd())};
  
  const isProd = env.command === 'build';
  if (isProd) {
    return {
      plugins: [
        svelte({
          // Using a svelte.config.js file causes a segmentation fault when importing the file
          configFile: false,
          preprocess: [vitePreprocess()],
        }), sentryVitePlugin({
          org: process.env.VITE_SENTRY_ORG,
          project: "betterbuff",
          telemetry: false,
          authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
          release: { name: `betterbuff@${releaseVersion}` },
          silent: true,
        })
      ],
      build: {
        sourcemap: true
      }
    };
  } else {
    return {
      plugins: [
        svelte({
          // Using a svelte.config.js file causes a segmentation fault when importing the file
          configFile: false,
          preprocess: [vitePreprocess()],
        })
      ]
    };
  }
};

const getManifest: ((env: ConfigEnv) => Partial<Manifest.WebExtensionManifest>) = (env) => {
  const manifest: Partial<Manifest.WebExtensionManifest> = {
    name: 'BetterBuff',
    description: 'Enhance your website experience on Buff163',
    version: releaseVersion,
    host_permissions: ["*://*.buff.163.com/*"],
    "permissions": ["storage"],
    web_accessible_resources: [{
      resources: ["inject.js", "ch_patterns.json"],
      matches: ["*://*.buff.163.com/*"]
    }],
  };
  if (env.browser === 'firefox') {
    manifest.developer = {
      name: "Rums",
      url: "https://github.com/GODrums"
    };
    manifest.browser_specific_settings = {
      "gecko": {
        "id": "betterbuff@rums.dev",
        "strict_min_version": "109.0"
      },
    };
  }
  return manifest;
};

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  manifest: getManifest,
  vite: getViteConfig,
  runner: {
    disabled: true,
  }
});
