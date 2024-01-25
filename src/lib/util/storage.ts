import { storage } from 'wxt/storage';
import type { BuffTypes } from '../@types/BuffTypes';

export let WINDOW_G: BuffTypes.G | null = null;
export let BUFF_CRX: any = null;

export function setBuffCrx(crx: any) {
    BUFF_CRX = crx;
}

export function setWindowG(g: BuffTypes.G) {
    WINDOW_G = g;
}

export const defaultStorage = {
    enabled: true,
    darkMode: false,
    hideFloatBar: false,
    showBigPreviews: false,
    dataProtection: false,
    listingDenominator: 0 as 0 | 1,
    listingDifferenceStyle: 1 as 0 | 1 | 2 | 3 | 4,
    platformTax: true,
    profitThreshold: 0,
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

    export const showBigPreviews = storage.defineItem<IStorage['showBigPreviews']>(
        'local:showBigPreviews',
        {
            defaultValue: defaultStorage.showBigPreviews,
        },
    );

    export const dataProtection = storage.defineItem<IStorage['dataProtection']>(
        'local:dataProtection',
        {
            defaultValue: defaultStorage.dataProtection,
        },
    );

    export const preferredPayments = storage.defineItem<IStorage['preferredPayments']>(
        'local:preferredPayments',
        {
            defaultValue: defaultStorage.preferredPayments,
        },
    );

    export const listingDenominator = storage.defineItem<IStorage['listingDenominator']>(
        'local:listingDenominator',
        {
            defaultValue: defaultStorage.listingDenominator,
        },
    );

    export const listingDifferenceStyle = storage.defineItem<IStorage['listingDifferenceStyle']>(
        'local:listingDifferenceStyle',
        {
            defaultValue: defaultStorage.listingDifferenceStyle,
        },
    );

    export const platformTax = storage.defineItem<IStorage['platformTax']>(
        'local:steamTax',
        {
            defaultValue: defaultStorage.platformTax,
        },
    );

    export const profitThreshold = storage.defineItem<IStorage['profitThreshold']>(
        'local:profitThreshold',
        {
            defaultValue: defaultStorage.profitThreshold,
        },
    );

    export const listingOptions = storage.defineItem<IStorage['listingOptions']>(
        'local:listingOptions',
        {
            defaultValue: defaultStorage.listingOptions,
        },
    );
}