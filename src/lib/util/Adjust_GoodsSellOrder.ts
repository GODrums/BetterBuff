import type { BuffTypes } from "../@types/BuffTypes";

export async function adjustGoodsSellOrder(apiData: BuffTypes.SellOrder.Data) {
    
    let rows = document.querySelectorAll('tr.selling');

    if (!apiData.items || rows.length < 0) return;

    
}