import { storage } from 'wxt/storage';
import type { BuffTypes } from '../@types/BuffTypes';

export let WINDOW_G: BuffTypes.G | null = null;

export function setWindowG(g: BuffTypes.G) {
    WINDOW_G = g;
}

export const defaultStorage = {
    enabled: true,
    listingOptions: {
        "3dinspect": true,
        inspectServer: true,
        inspectIngame: true,
        copyGen: true,
        share: true,
        matchFloat: true,
        findSimilar: true,
        detail: true,
    }
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

    export const listingOptions = storage.defineItem<IStorage['listingOptions']>(
        'local:listingOptions',
        {
            defaultValue: defaultStorage.listingOptions,
        },
    );
}