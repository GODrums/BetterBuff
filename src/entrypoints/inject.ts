let loadNumber = 0;

export default defineUnlistedScript({
    main() {
        openIntercept();
    },
});

function openIntercept() {
    const open = window.XMLHttpRequest.prototype.open;
    console.log('[BetterBuff] Activating HttpRequest Intercept...');

    window.XMLHttpRequest.prototype.open = function () {
        (<XMLHttpRequest>this).addEventListener('load', (e) => {
            const target = <XMLHttpRequest>e.currentTarget;
            if (!target.responseURL.includes(location.hostname)) {
                console.debug('[BetterBuff] Ignoring HTTP request to: ' + target.responseURL);
                return;
            }

            function parseJSON(text: string): undefined | any {
                try {
                    return JSON.parse(text);
                } catch (_) {
                    return {
                        text: text,
                    };
                }
            }

            // request finished loading
            if (target.readyState == 4) {
                document.dispatchEvent(
                    new CustomEvent('BetterBuff_INTERCEPTED_REQUEST', {
                        detail: {
                            status: target.status,
                            url: target.responseURL,
                            data: parseJSON(target.responseText),
                        },
                    })
                );
                // dispatch again on first page load
                if (loadNumber++ == 0) {
                    setTimeout(() => {
                        const globalG = window['g' as any];
                        document.dispatchEvent(
                            new CustomEvent('BetterBuff_INTERCEPTED_REQUEST', {
                                detail: {
                                    status: 200,
                                    url: 'betterbuff_global_data',
                                    data: globalG,
                                },
                            })
                        );
                    }, 100);
                }
            }
        });

        return open.apply(this, <any>arguments);
    };
}
