import { defineConfig, type ConfigEnv, type WxtViteConfig } from 'wxt';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { loadEnv } from 'vite';

const releaseVersion = '0.5.0';

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

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  manifest: {
    name: 'BetterBuff',
    description: 'Enhance your website experience on Buff163',
    version: releaseVersion,
    host_permissions: ["*://*.buff.163.com/*"],
    "permissions": ["storage"],
    web_accessible_resources: [{
      resources: ["inject.js"],
      matches: ["*://*.buff.163.com/*"]
    }],
  },
  vite: getViteConfig,
  runner: {
    disabled: true,
  }
});
