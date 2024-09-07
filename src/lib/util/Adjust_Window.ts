import Decimal from 'decimal.js';
import { WINDOW_G } from './storage';

export function adjustWindow() {
	adjustWallet();

	if (location.pathname.startsWith('/user-center')) {
		addLottery();
	}
}

function adjustWallet() {
	const walletAmount = document.querySelector('#navbar-cash-amount');
	const currency = WINDOW_G?.currency;
	if (!walletAmount || !currency || currency.code === 'CNY') return;

	walletAmount.appendChild(document.createElement('br'));

	const amountCNY = walletAmount.textContent?.split(/\s/)[1] ?? '0';

	try {
		const convertedElement = `<span class="c_Gray f_12px">(${currency.symbol} ${new Decimal(amountCNY).mul(currency.rate_base_cny).toFixed(2)})</span>`;
		walletAmount.insertAdjacentHTML('beforeend', convertedElement);
	} catch (e) {
		console.error('Failed to convert wallet amount to CNY: ', e);
	}
}

function addLottery() {
	const menu = document.querySelector('.my-menu > ul');

	if (!menu) return;

	const lottery = document.createElement('li');

	lottery.innerHTML = '<a class="betterbuff-lottery-a"><i class="icon icon_menu icon_menu_gift"></i>Lottery</a>';

	menu.appendChild(lottery);

	lottery.addEventListener('click', () => {
		const mainPage = document.querySelector('div.cont_main');
		if (!mainPage) return;

		const clientHeight = document.querySelector('div.cont_panel')?.clientHeight;
		mainPage.innerHTML = `<object type="text/html" data="/s/lottery.html" style="width: 100%; height: ${clientHeight ?? '600'}px;"></object>`;
		document.querySelector('.my-menu > ul > li.on')?.classList.remove('on');
		lottery.classList.add('on');
		// add html as search param
		const url = new URL(location.href);
		url.searchParams.set('bb-state', 'lottery');
		history.pushState(null, '', url.toString());
	});

	// check if we need to load lottery page
	if (new URL(location.href).searchParams.get('bb-state') === 'lottery') {
		lottery.click();
	}
}
