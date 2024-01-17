import Decimal from "decimal.js";
import { ExtensionStorage } from "./storage";
import { PAYMENT_MAPPING } from "./globals";

export function priceToHtml(price: number) {
    const priceParts = price.toFixed(2).split('.');
    let dps = ``;
    if (priceParts[1]) {
        const cutDps = priceParts[1].split('0')[0];
        if (cutDps.length > 0) {
            dps = `<small>.${cutDps}</small>`;
        }
    }
    return `${priceParts[0]}${dps}`;
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