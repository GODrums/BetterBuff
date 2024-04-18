import { defineConfig, type ConfigEnv, type WxtViteConfig } from 'wxt';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import type { Manifest } from 'wxt/browser';
import path from 'path';

const releaseVersion = '0.8.0';

const getViteConfig: (env: ConfigEnv) => WxtViteConfig | Promise<WxtViteConfig> = () => {
    return {
        plugins: [
            svelte({
                // Using a svelte.config.js file causes a segmentation fault when importing the file
                configFile: false,
                preprocess: [vitePreprocess()],
                onwarn(warning, defaultHandler) {
                    if (warning.code === 'a11y-click-events-have-key-events') return;

                    // handle all other warnings normally
                    defaultHandler?.(warning);
                },
            }),
        ],
        build: {
            sourcemap: true,
        },
        resolve: {
            alias: {
                $lib: path.resolve('./src/lib'),
            },
        },
    };
};

const getManifest: (env: ConfigEnv) => Partial<Manifest.WebExtensionManifest> = (env) => {
    const manifest: Partial<Manifest.WebExtensionManifest> = {
        name: 'BetterBuff',
        description: 'Enhance your website experience on Buff163',
        version: releaseVersion,
        host_permissions: ['*://*.buff.163.com/*'],
        permissions: ['storage'],
        web_accessible_resources: [
            {
                resources: ['inject.js', 'ch_patterns.json'],
                matches: ['*://*.buff.163.com/*'],
            },
        ],
    };
    if (env.browser === 'firefox') {
        manifest.developer = {
            name: 'Rums',
            url: 'https://github.com/GODrums',
        };
        manifest.browser_specific_settings = {
            gecko: {
                id: 'betterbuff@rums.dev',
                strict_min_version: '109.0',
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
    },
});
