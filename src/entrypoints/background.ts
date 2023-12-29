import { ExtensionStorage } from "@/lib/util/storage";

export default defineBackground(() => {
    console.log('Hello background!', { id: browser.runtime.id });
    ExtensionStorage.enabled.getValue().then((enabled) => {
        console.log('enabled: ', enabled);
    });
    browser.runtime.onInstalled.addListener(() => {
        console.log('onInstalled');
    });
});
