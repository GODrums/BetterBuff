import type { BuffTypes } from "../@types/BuffTypes";
import { adjustGoodsSellOrder } from "./Adjust_GoodsSellOrder";

export interface EventData<T> {
    status: string;
    url: string;
    data: T;
}

export function activateHandler() {
    // important: https://stackoverflow.com/questions/9515704/access-variables-and-functions-defined-in-page-context-using-a-content-script/9517879#9517879
    document.addEventListener('BetterBuff_INTERCEPTED_REQUEST', function (e) {
        const eventData = (<CustomEvent>e).detail as EventData<unknown>;
        
        if (eventData.url.startsWith('https://buff.163.com/api')) {
            processEvent(eventData);
        } else if (eventData.url.startsWith('betterbuff')) {
            // do something
        }
    });
}

function processEvent(eventData: EventData<unknown>) {
    console.debug('[BetterBuff] Received data from url: ' + eventData.url + ', data:', eventData.data);
    if (eventData.url.includes('api/market/goods/sell_order')) {
        // do something
        adjustGoodsSellOrder((eventData as EventData<BuffTypes.SellOrder.Response>).data.data);
    }
}