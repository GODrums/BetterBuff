import Decimal from 'decimal.js';
import { ExtensionStorage, type IStorage, WINDOW_G } from './storage';
import { PAYMENT_MAPPING } from './globals';

export function priceToHtml(price: number, symbol: string | null = null, space: boolean = false) {
    const priceParts = price.toFixed(2).split('.');
    if (!priceParts) return '';
    const dps = (parseInt(priceParts[0]) < 1000 && priceParts[1] && parseInt(priceParts[1]) > 0) ? `<small>.${priceParts[1]}</small>` : '';
    return `${symbol ?? ''}${space ? ' ' : ''}${priceParts[0]}${dps}`;
}

export function getListingDifference(price: number, steamPriceCNY: number, style: IStorage['listingDifferenceStyle'], steamTax: IStorage['platformTax'], profitThreshold?: IStorage['profitThreshold'], listingDenominator?: IStorage['listingDenominator']) {
    if (!(style > 0)) return '';

    if (steamTax > 0) {
        if (listingDenominator == 1) {
            if (steamTax == 1) {
                steamPriceCNY = new Decimal(steamPriceCNY).mul(0.975).toDP(2).toNumber();
            } else {
                price = new Decimal(price).mul(0.975).toDP(2).toNumber();
            }
        } else {
            steamPriceCNY = new Decimal(steamPriceCNY).div(1.15).minus(0.01).toDP(2).toNumber();
        }
    }

    let priceDiff = new Decimal(price).minus(steamPriceCNY);
    let priceDiffEx = `Platform price: ¥ ${steamPriceCNY} | Buff price: ¥ ${price}&#10;${price} - ${steamPriceCNY} = ${priceDiff.toFixed(2)}&#10;`;

    let priceDiffStr = '';
    if (style == 1) {
        const sign = priceDiff.isZero() ? '' : (priceDiff.isNegative() ? '-' : '+');
        priceDiffStr = `${sign}¥ ${priceToHtml(priceDiff.absoluteValue().toNumber())}`;
        priceDiffEx += `=> This item is ¥ ${priceDiff.absoluteValue().toFixed(2)} ${priceDiff.isNegative() ? 'cheaper' : 'more expensive'} than on Steam.`;
    } else if (style == 2) {
        const convertedDiff = priceDiff.mul(WINDOW_G?.currency?.rate_base_cny ?? 1).toDP(2);
        const sign = convertedDiff.isZero() ? '' : (convertedDiff.isNegative() ? '-' : '+');
        const currencySymbol = WINDOW_G?.currency?.symbol ?? '¥';
        priceDiffStr = `${sign}${currencySymbol} ${Math.abs(convertedDiff.toNumber())}`;
        priceDiffEx += `=> ${currencySymbol} ${convertedDiff}&#10;`;
        priceDiffEx += `=> This item is ${currencySymbol} ${Math.abs(convertedDiff.toNumber()).toFixed(2)} ${priceDiff.isNegative() ? 'cheaper' : 'more expensive'} than on Steam.`;
    } else if (style == 3) {
        const priceRel = priceDiff.div(steamPriceCNY).mul(100).toDP(2);
        const sign = priceRel.isZero() ? '' : (priceRel.isNegative() ? '-' : '+');
        priceDiffStr = `${sign}${priceToHtml(priceRel.absoluteValue().toNumber())}%`;
        priceDiffEx += `=> ${priceDiff.toFixed(2)} / ${steamPriceCNY} * 100&#10;`;
        priceDiffEx += `=> This item is ${priceRel.absoluteValue().toNumber()}% ${priceDiff.isNegative() ? 'cheaper' : 'more expensive'} than on Steam.`;
    } else if (style == 4) {
        const priceRel = priceDiff.div(steamPriceCNY).mul(100).toDP(2);
        const sign = priceRel.isZero() ? '' : (priceRel.isNegative() ? '-' : '+');
        priceDiffStr = `${sign}¥ ${priceToHtml(priceDiff.absoluteValue().toNumber())}`;
        const priceDiffStr2 = `${sign}${priceToHtml(priceRel.absoluteValue().toNumber())}%`;
        const coloring = (steamTax == 2 && priceRel.greaterThan(profitThreshold ?? 0)) || (steamTax < 2 && priceRel.lessThan(profitThreshold ?? 0)) ? '#009800' : '#c90000';
        return `<div class="f_12px" style="color: ${coloring}; font-weight: 700;" title="${priceDiffEx}">${priceDiffStr}<br>${priceDiffStr2}</div>`;
    }

    return `<div class="f_12px" style="color: ${priceDiff.lessThan(profitThreshold ?? 0) ? '#009800' : '#c90000'}; font-weight: 700;" title="${priceDiffEx}">${priceDiffStr}</div>`;
}

export function convertSP(sticker_premium: number) {
    let stickerText = '% SP';
    let stickerPercentage = new Decimal(sticker_premium).mul(100);
    if (stickerPercentage.gte(100)) {
        stickerText = '>100' + stickerText;
    } else if (stickerPercentage.lt(10)) {
        stickerText = stickerPercentage.toDP(2).toString() + stickerText;
    } else {
        stickerText = stickerPercentage.toDP(0).toString() + stickerText;
    }
    return stickerText;
}

export async function isPaymentMethodAvailable(paymentMethods: number[]) {
    const preferredPayments = await ExtensionStorage.preferredPayments.getValue();
    let isAvailable = false;
    for (const paymentMethod of paymentMethods) {
        if (preferredPayments[PAYMENT_MAPPING[paymentMethod as keyof typeof PAYMENT_MAPPING] as keyof typeof preferredPayments]) {
            isAvailable = true;
            break;
        }
    }
    return isAvailable;
}

/**
 * Given an item name and a list of lower-case keywords returns the item name where the occurrences any of
 * the keywords (case-insensitive) is highlighted using <match> XML tags.
 * @param itemName - the item name.
 * @param keywords - the keywords.
 */
export function getMatchedItemName(itemName: string, keywords: string[]): string {
    const itemNameLower = itemName.toLowerCase();
    // the set of character indices in the itemName that are part of a keyword match
    const matchedIndices: Set<number> = new Set();

    // find matching characters that are part of a keyword
    for (const keyword of keywords) {
        let i = 0;

        while (i < itemNameLower.length) {
            const nextMatch = itemNameLower.indexOf(keyword, i);

            if (nextMatch === -1) {
                break;
            }

            // add matching indices
            for (let j = 0; j < keyword.length; j++) {
                matchedIndices.add(nextMatch + j);
            }

            i = nextMatch + keyword.length;
        }
    }

    // construct matched item name string
    let matchedItemName = '';
    let isMatchingGroup = false;
    for (let i = 0; i < itemName.length; i++) {
        if (matchedIndices.has(i) && !isMatchingGroup) {
            // start a new matching group
            isMatchingGroup = true;
            matchedItemName += '<match>';
        } else if (!matchedIndices.has(i) && isMatchingGroup) {
            // end current matching group
            isMatchingGroup = false;
            matchedItemName += '</match>';
        }

        matchedItemName += itemName.charAt(i);
    }

    if (isMatchingGroup) {
        matchedItemName += '</match>';
    }

    return matchedItemName;
}
