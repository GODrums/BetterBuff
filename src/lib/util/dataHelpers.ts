import Decimal from "decimal.js";

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