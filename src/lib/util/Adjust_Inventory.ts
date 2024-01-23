import Decimal from "decimal.js";
import { addItemLink, createMutationObserver } from "./uiGeneration";

export async function handleInventory() {
    createMutationObserver('.popup.popup_charge', addItemLink).observe(document.body, { childList: true, subtree: true });

    const cards = document.querySelectorAll('#j_list_card li.my_selling');
    for (let i = 0; i < cards.length; i++) {
        const card = <HTMLElement>cards[i];
        const price = card.dataset.price ?? '0';

        const priceDiv = card.querySelector('strong.f_Strong');

        if (priceDiv) {
            const cutPrice = parseInt(price);
            const newPrice = `<strong class="f_Strong">¥ ${cutPrice}<small>.${new Decimal(price)
                .minus(cutPrice)
                .mul(100)
                .toDP(2)
                .toNumber()}</small></strong><span class="c_Gray f_12px" style="vertical-align: bottom;"> (${priceDiv.innerHTML})</span>`;
            priceDiv.outerHTML = newPrice;
        }
    }

}