import { storage } from 'wxt/storage';
import type { BuffTypes } from '../@types/BuffTypes';

export let WINDOW_G: BuffTypes.G | null = null;

export function setWindowG(g: BuffTypes.G) {
    WINDOW_G = g;
}

export const defaultStorage = {
    enabled: true,
    darkMode: false,
    hideFloatBar: false,
    listingOptions: {
        "3dinspect": true,
        inspectServer: true,
        inspectIngame: true,
        copyGen: true,
        share: true,
        matchFloat: true,
        findSimilar: true,
        detail: true,
    },
    preferredPayments: {
        'balance': true,
        'card': true,
        'bank': true,
        'wechat': true,
        'wechat-split': true,
    },
};

export type IStorage = typeof defaultStorage;
export type EStorage = { key: keyof IStorage, value: IStorage[keyof IStorage] }[];

export namespace ExtensionStorage {
    export const enabled = storage.defineItem<IStorage['enabled']>(
        'local:enabled',
        {
          defaultValue: defaultStorage.enabled,
        },
    );

    export const darkMode = storage.defineItem<IStorage['darkMode']>(
        'local:darkMode',
        {
            defaultValue: defaultStorage.darkMode,
        },
    );

    export const hideFloatBar = storage.defineItem<IStorage["hideFloatBar"]>(
        'local:hideFloatBar',
        {
            defaultValue: defaultStorage.hideFloatBar,
        },
    );

    export const preferredPayments = storage.defineItem<IStorage['preferredPayments']>(
        'local:preferredPayments',
        {
            defaultValue: defaultStorage.preferredPayments,
        },
    );

    export const listingOptions = storage.defineItem<IStorage['listingOptions']>(
        'local:listingOptions',
        {
            defaultValue: defaultStorage.listingOptions,
        },
    );
}