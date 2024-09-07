import type { BuffTypes } from "../@types/BuffTypes";
import { convertSP } from "./dataHelpers";

export function adjustTooltip(tooltip: HTMLElement) {
	const itemData = (tooltip.querySelector("a.btn-buy-order") as HTMLElement)?.dataset;
	if (!itemData || !itemData.assetInfo) return;

	const assetInfo = JSON.parse(itemData.assetInfo);
	const card = document.querySelector(`#sell_order_${itemData.orderid}`) as HTMLElement | null;

	if (!card) return;

	const item = JSON.parse(card.dataset.item ?? "{}") as BuffTypes.TopPopular.Item;

	const stickerHeading = Array.from(tooltip.querySelectorAll("h4")).pop();

	if (stickerHeading?.innerText.includes("Include sticker")) {
		stickerHeading.setAttribute("style", "display: flex; gap: 15px; align-items: center;");
		const spDiv = document.createElement("div");
		spDiv.setAttribute("style", "background-color: rgb(72 61 139 / 50%); padding: 5px 10px; border-radius: 20px; font-weight: 500; font-size: small;");
		spDiv.innerText = convertSP(item.sticker_premium ?? 0);
		stickerHeading.appendChild(spDiv);
	}
}
