import Decimal from "decimal.js";

export async function handleSales() {
    applyPopupMutation();

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

function applyPopupMutation() {
    const observer = new MutationObserver(async (mutations) => {
        for (const mutation of mutations) {
            for (let i = 0; i < mutation.addedNodes.length; i++) {
                const addedNode = mutation.addedNodes[i];
                // some nodes are not elements, so we need to check
                if (!(addedNode instanceof HTMLElement)) continue;

                if (addedNode.className === 'popup popup_charge') {
                    // console.debug('[SkinComparison] Mutation detected:', addedNode, addedNode.tagName, addedNode.className.toString());
                    addPricingButton(addedNode);
                }
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

function addPricingButton(popup: HTMLElement) {
    const items = Array.from(popup.querySelectorAll('tr.assets-item'));
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const priceElement = item.querySelector('.price-set > input ') as HTMLInputElement | null;
        const dataset = priceElement?.dataset;

        if (!priceElement || !dataset?.price) {
            console.debug('[BetterBuff] No price found for ', item);
            continue;
        }

        const h3 = item.querySelector('h3');
        if (h3 && !h3.querySelector('a')) {
            h3.innerHTML = `<a href="https://buff.163.com/goods/${dataset.goodsid}" target="_blank">${h3.innerHTML}</a>`;
        }
    }
}