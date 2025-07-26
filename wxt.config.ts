import { defineConfig, type ConfigEnv, type UserManifest, type UserManifestFn, type WxtViteConfig } from 'wxt';
import path from 'node:path';

const releaseVersion = '0.8.6';

const getViteConfig: (env: ConfigEnv) => WxtViteConfig | Promise<WxtViteConfig> = () => {
    return {
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

const getManifest: UserManifestFn = (env) => {
    const manifest: UserManifest = {
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
	publicDir: 'src/public', 
	modulesDir: 'src/modules',
    manifest: getManifest,
    vite: getViteConfig,
	modules: ['@wxt-dev/module-svelte', '@wxt-dev/webextension-polyfill'],
    svelte: {
        vite: {
            configFile: false,
            onwarn(warning, defaultHandler) {
                if (warning.code === "a11y-click-events-have-key-events") return;
                if (warning.code === "a11y_consider_explicit_label") return;
        
                // handle all other warnings normally
                defaultHandler?.(warning);
            },
        },
    },
    webExt: {
        disabled: true,
    },
});
