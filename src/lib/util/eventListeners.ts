import type { BuffTypes } from "../@types/BuffTypes";
import { adjustGoodsSellOrder } from "./Adjust_GoodsSellOrder";
import { adjustSearchPage, adjustTopBookmarked } from "./Adjust_Market";
import { adjustWindow } from "./Adjust_Window";
import { setWindowG } from "./storage";

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
            console.debug('[BetterBuff] Received Window G from event ' + eventData.url + ': ', eventData.data);
            setWindowG((eventData as EventData<BuffTypes.G>).data);
            adjustWindow();
        }
    });
}

function processEvent(eventData: EventData<unknown>) {
    if (!eventData.url.includes('notification')) {
        console.debug('[BetterBuff] Received data from url: ' + eventData.url + ', data:', eventData.data);
    }
    if (eventData.url.includes('api/market/goods/sell_order')) {
        adjustGoodsSellOrder((eventData as EventData<BuffTypes.SellOrder.Response>).data.data);
    } else if (eventData.url.includes('api/market/goods?')) {
        adjustSearchPage((eventData as EventData<BuffTypes.MarketGoods.Response>).data.data);
    } else if (eventData.url.includes('api/market/goods/buying?')) {
        adjustSearchPage((eventData as EventData<BuffTypes.MarketGoods.Response>).data.data);
    } else if (eventData.url.includes('api/market/sell_order/top_bookmarked?')) {
        adjustTopBookmarked((eventData as EventData<BuffTypes.TopPopular.Response>).data.data);
    }
}