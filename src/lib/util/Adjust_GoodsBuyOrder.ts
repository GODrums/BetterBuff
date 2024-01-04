import type { BuffTypes } from "../@types/BuffTypes";
import { isPaymentMethodAvailable } from "./dataHelpers";

export async function adjustGoodsBuyOrder(apiData: BuffTypes.BuyOrder.Data) {
    let rows = document.querySelectorAll('.list_tb_csgo > tr');

    if (!apiData.items || rows.length < 0) return;

    for (let i = 1; i < rows.length; i++) {
        let row = <HTMLElement>rows[i];
        let item = apiData.items[i - 1];

        if (!item) {
            console.log('API Data: ', apiData);
        }
        if (item.pay_method !== 43 && !await isPaymentMethodAvailable([item.pay_method])) {
            markPurchaseUnavailable(row);
        }
    }
}

function markPurchaseUnavailable(row: HTMLElement) {
    const purchaseButton = row.querySelector('td.t_Left > a.i_Btn');
    if (purchaseButton) {
        purchaseButton.setAttribute('style', 'background-color: gray; cursor: not-allowed;');
    }
}