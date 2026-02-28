import Decimal from 'decimal.js';
import { ExtensionStorage } from './storage';

// --- Types ---

interface RatesData {
	lastUpdate: string;
	rates: Record<string, number>;
}

export interface ConversionResult {
	symbol: string;
	value: string;
	valueRaw: number;
	currencyCode: string;
	rate: number;
	decimalPlaces: number;
	originalCNY: number;
}

export interface ConversionInfo {
	rate: number;
	symbol: string;
	code: string;
}

// --- Module-level cache ---

let cachedRates: RatesData['rates'] = {};
const cachedSymbols: Record<string, string> = {
	AED: 'د.إ',
	AFN: '؋',
	ALL: 'L',
	AMD: '֏',
	ANG: 'ƒ',
	AOA: 'Kz',
	ARS: '$',
	AUD: 'A$',
	AWG: 'ƒ',
	AZN: '₼',
	BAM: 'KM',
	BBD: 'Bds$',
	BDT: '৳',
	BGN: 'лв',
	BHD: '.د.ب',
	BIF: 'FBu',
	BMD: '$',
	BND: 'B$',
	BOB: 'Bs.',
	BRL: 'R$',
	BSD: '$',
	BTC: '₿',
	BTN: 'Nu.',
	BWP: 'P',
	BYN: 'Br',
	BZD: 'BZ$',
	CAD: 'C$',
	CDF: 'FC',
	CHF: 'CHF',
	CLP: 'CL$',
	CNH: '¥',
	CNY: '¥',
	COP: 'COL$',
	CRC: '₡',
	CUC: '$',
	CUP: '₱',
	CVE: '$',
	CZK: 'Kč',
	DJF: 'Fdj',
	DKK: 'kr',
	DOP: 'RD$',
	DZD: 'د.ج',
	EGP: 'E£',
	ERN: 'Nfk',
	ETB: 'Br',
	EUR: '€',
	FJD: 'FJ$',
	FKP: '£',
	GBP: '£',
	GEL: '₾',
	GGP: '£',
	GHS: 'GH₵',
	GIP: '£',
	GMD: 'D',
	GNF: 'FG',
	GTQ: 'Q',
	GYD: 'GY$',
	HKD: 'HK$',
	HNL: 'L',
	HRK: 'kn',
	HTG: 'G',
	HUF: 'Ft',
	IDR: 'Rp',
	ILS: '₪',
	IMP: '£',
	INR: '₹',
	IQD: 'ع.د',
	IRR: '﷼',
	ISK: 'kr',
	JEP: '£',
	JMD: 'J$',
	JOD: 'JD',
	JPY: '¥',
	KES: 'KSh',
	KGS: 'сом',
	KHR: '៛',
	KMF: 'CF',
	KPW: '₩',
	KRW: '₩',
	KWD: 'د.ك',
	KYD: 'CI$',
	KZT: '₸',
	LAK: '₭',
	LBP: 'L£',
	LKR: 'Rs',
	LRD: 'L$',
	LSL: 'M',
	LTL: 'Lt',
	LVL: 'Ls',
	LYD: 'LD',
	MAD: 'MAD',
	MDL: 'MDL',
	MGA: 'Ar',
	MKD: 'ден',
	MMK: 'K',
	MNT: '₮',
	MOP: 'MOP$',
	MRU: 'UM',
	MUR: '₨',
	MVR: 'Rf',
	MWK: 'MK',
	MXN: 'MX$',
	MYR: 'RM',
	MZN: 'MT',
	NAD: 'N$',
	NGN: '₦',
	NIO: 'C$',
	NOK: 'kr',
	NPR: '₨',
	NZD: 'NZ$',
	OMR: '﷼',
	PAB: 'B/.',
	PEN: 'S/.',
	PGK: 'K',
	PHP: '₱',
	PKR: '₨',
	PLN: 'zł',
	PYG: '₲',
	QAR: '﷼',
	RON: 'lei',
	RSD: 'din.',
	RUB: '₽',
	RWF: 'RF',
	SAR: '﷼',
	SBD: 'SI$',
	SCR: '₨',
	SDG: 'LS',
	SEK: 'kr',
	SGD: 'S$',
	SHP: '£',
	SLE: 'Le',
	SLL: 'Le',
	SOS: 'Sh',
	SRD: '$',
	STD: 'Db',
	SVC: '₡',
	SYP: '£S',
	SZL: 'E',
	THB: '฿',
	TJS: 'SM',
	TMT: 'T',
	TND: 'د.ت',
	TOP: 'T$',
	TRY: '₺',
	TTD: 'TT$',
	TWD: 'NT$',
	TZS: 'TSh',
	UAH: '₴',
	UGX: 'USh',
	USD: '$',
	UYU: '$U',
	UZS: 'сўм',
	VEF: 'Bs.F',
	VES: 'Bs.S',
	VND: '₫',
	VUV: 'VT',
	WST: 'WS$',
	XAF: 'FCFA',
	XAG: 'oz',
	XAU: 'oz',
	XCD: 'EC$',
	XDR: 'SDR',
	XOF: 'CFA',
	XPF: '₣',
	YER: '﷼',
	ZAR: 'R',
	ZMK: 'ZK',
	ZMW: 'ZK',
	ZWL: 'Z$',
};
let currencyConversionEnabled = false;
let selectedCurrency = 'USD';
let customCurrencyRate = 1;
let customCurrencyName = 'CC';
let ratesInitialized = false;

// --- Static fallback rates (from CNY to target currency) ---

const STATIC_RATES_JSON = `{
"date":"static",
"rates":{
"AED":[0.5275,2],"AFN":[9.4095,2],"ALL":[11.9448,2],"AMD":[54.4748,2],"ANG":[0.2572,2],
"AOA":[126.0,2],"ARS":[144.0,2],"AUD":[0.2134,2],"AWG":[0.2587,2],"AZN":[0.2441,2],
"BAM":[0.2396,2],"BBD":[0.2873,2],"BDT":[17.1475,2],"BGN":[0.2396,2],"BHD":[0.0542,3],
"BIF":[418.0,2],"BMD":[0.1437,2],"BND":[0.1898,2],"BOB":[0.9924,2],"BRL":[0.8283,2],
"BSD":[0.1437,2],"BTC":[0.0000016,7],"BTN":[12.1689,2],"BWP":[1.8787,2],"BYN":[0.4697,2],
"BZD":[0.2896,2],"CAD":[0.2018,2],"CDF":[404.0,2],"CHF":[0.1255,2],"CLF":[0.0035,4],
"CLP":[138.0,2],"CNH":[1.0,4],"CNY":[1.0,2],"COP":[594.0,2],"CRC":[72.0,2],
"CUC":[0.1437,2],"CUP":[3.4477,2],"CVE":[13.502,2],"CZK":[3.0766,2],"DJF":[25.5423,2],
"DKK":[0.9139,2],"DOP":[8.76,2],"DZD":[19.165,2],"EGP":[7.1452,2],"ERN":[2.1548,2],
"ETB":[17.4959,2],"EUR":[0.1225,2],"FJD":[0.3197,2],"FKP":[0.1069,2],"GBP":[0.1069,2],
"GEL":[0.3972,2],"GGP":[0.1069,2],"GHS":[2.155,2],"GIP":[0.1069,2],"GMD":[10.0,2],
"GNF":[1236.0,2],"GTQ":[1.109,2],"GYD":[30.06,2],"HKD":[1.1179,2],"HNL":[3.6124,2],
"HRK":[0.923,2],"HTG":[18.847,2],"HUF":[49.0,2],"IDR":[2288.0,2],"ILS":[0.5145,2],
"IMP":[0.1069,2],"INR":[12.169,2],"IQD":[188.0,2],"IRR":[6050.0,2],"ISK":[18.985,2],
"JEP":[0.1069,2],"JMD":[22.0,2],"JOD":[0.1019,3],"JPY":[21.78,0],"KES":[18.6,2],
"KGS":[12.45,2],"KHR":[578.0,2],"KMF":[60.27,2],"KPW":[129.0,2],"KRW":[197.0,0],
"KWD":[0.0441,3],"KYD":[0.1197,2],"KZT":[70.8,2],"LAK":[3140.0,2],"LBP":[12880.0,2],
"LKR":[42.26,2],"LRD":[25.83,2],"LSL":[2.547,2],"LTL":[0.4242,2],"LVL":[0.0869,2],
"LYD":[0.691,3],"MAD":[1.35,2],"MDL":[2.535,2],"MGA":[648.0,2],"MKD":[7.526,2],
"MMK":[301.0,2],"MNT":[491.0,2],"MOP":[1.1563,2],"MRU":[5.71,2],"MUR":[6.37,2],
"MVR":[2.217,2],"MWK":[249.0,2],"MXN":[2.87,2],"MYR":[0.6192,2],"MZN":[9.17,2],
"NAD":[2.547,2],"NGN":[222.0,2],"NIO":[5.28,2],"NOK":[1.4756,2],"NPR":[19.47,2],
"NZD":[0.2366,2],"OMR":[0.0553,3],"PAB":[0.1437,2],"PEN":[0.5303,2],"PGK":[0.571,2],
"PHP":[8.19,2],"PKR":[39.92,2],"PLN":[0.5248,2],"PYG":[1117.0,2],"QAR":[0.5232,2],
"RON":[0.6094,2],"RSD":[14.34,2],"RUB":[14.21,2],"RWF":[196.0,2],"SAR":[0.5388,2],
"SBD":[1.2,2],"SCR":[2.046,2],"SDG":[86.0,2],"SEK":[1.4255,2],"SGD":[0.1898,2],
"SHP":[0.1069,2],"SLE":[3.23,2],"SLL":[3230.0,2],"SOS":[82.0,2],"SRD":[4.96,2],
"STD":[2974.0,2],"SVC":[1.257,2],"SYP":[1867.0,2],"SZL":[2.547,2],"THB":[4.819,2],
"TJS":[1.525,2],"TMT":[0.5028,2],"TND":[0.432,3],"TOP":[0.3313,2],"TRY":[5.05,2],
"TTD":[0.978,2],"TWD":[4.614,2],"TZS":[369.0,2],"UAH":[5.97,2],"UGX":[527.0,2],
"USD":[0.1437,2],"UYU":[6.08,2],"UZS":[1838.0,2],"VEF":[524000.0,2],"VES":[7.79,2],
"VND":[3620.0,0],"VUV":[16.99,2],"WST":[0.3928,2],"XAF":[80.36,2],"XAG":[0.0043,4],
"XAU":[0.0000482,5],"XCD":[0.3883,2],"XDR":[0.1044,2],"XOF":[80.36,2],"XPF":[14.62,2],
"YER":[35.74,2],"ZAR":[2.547,2],"ZMK":[1293.0,2],"ZMW":[3.82,2],"ZWL":[46.25,2]
}
}`;

// Common currencies to show at the top of selection lists
export const COMMON_CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY', 'RUB', 'BRL', 'KRW', 'TRY', 'PLN', 'SEK', 'NOK', 'DKK', 'NZD', 'SGD', 'HKD', 'MXN', 'INR'];

/**
 * Initialize static fallback rates. This is synchronous and should be called early.
 */
export function initializeStaticRates(): void {
	if (ratesInitialized) return;
	try {
		const data = JSON.parse(STATIC_RATES_JSON);
		const parsed: Record<string, number> = {};
		for (const [code, value] of Object.entries(data.rates)) {
			parsed[code] = Array.isArray(value) ? (value as number[])[0] : (value as number);
		}
		cachedRates = parsed;
		ratesInitialized = true;
	} catch (e) {
		console.error('[BetterBuff] Failed to parse static rates:', e);
	}
}

/**
 * Load currency settings from storage into module-level cache for synchronous access.
 */
export async function loadCurrencySettings(): Promise<void> {
	currencyConversionEnabled = await ExtensionStorage.currencyConversionEnabled.getValue();
	selectedCurrency = await ExtensionStorage.selectedCurrency.getValue();
	customCurrencyRate = await ExtensionStorage.customCurrencyRate.getValue();
	customCurrencyName = await ExtensionStorage.customCurrencyName.getValue();
}

/**
 * Fetch live exchange rates. Checks cache date first; if stale, fetches fresh rates
 * via the background script to avoid CSP/CORS issues.
 */
export async function loadRates(): Promise<void> {
	try {
		const now = Date.now();
		const cacheDate = await ExtensionStorage.currencyCacheDate.getValue();
		const cacheAgeMs = cacheDate ? now - new Date(cacheDate).getTime() : Infinity;
		const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

		if (cacheAgeMs < oneWeekMs) {
			const cached = await ExtensionStorage.currencyCache.getValue();
			if (cached) {
				const data: RatesData = JSON.parse(cached);
				cachedRates = data.rates;
				ratesInitialized = true;
				return;
			}
		}

		const response = await browser.runtime.sendMessage({ type: 'BetterBuff_FETCH_RATES' });
		if (response?.success && response.data) {
			const data: RatesData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
			cachedRates = data.rates;
			ratesInitialized = true;

			await ExtensionStorage.currencyCache.setValue(JSON.stringify(data));
			await ExtensionStorage.currencyCacheDate.setValue(new Date(now).toISOString());
		} else {
			console.warn('[BetterBuff] Failed to fetch rates, using fallback:', response?.error);
		}
	} catch (e) {
		console.warn('[BetterBuff] Error loading rates, using fallback:', e);
	}
}

/**
 * Get the effective rate and info for the currently selected currency.
 */
function getEffectiveRate(): { rate: number; symbol: string; code: string; decimalPlaces: number } {
	if (selectedCurrency === '---') {
		return {
			rate: customCurrencyRate === 0 ? 1 : 1 / customCurrencyRate,
			symbol: customCurrencyName,
			code: '---',
			decimalPlaces: 2,
		};
	}

	// first convert to USD (the base currency), then to selected currency
	const rmbRate = cachedRates.CNY;
	const rateEntry = cachedRates[selectedCurrency];
	if (!rateEntry) {
		return { rate: 1, symbol: '¥', code: 'CNY', decimalPlaces: 2 };
	}

	return {
		rate: rateEntry / rmbRate,
		symbol: cachedSymbols[selectedCurrency] ?? selectedCurrency,
		code: selectedCurrency,
		decimalPlaces: 2,
	};
}

/**
 * Convert a CNY amount to the selected currency. Synchronous - uses pre-loaded rates.
 */
export function convertCNY(cny: number): ConversionResult {
	const { rate, symbol, code, decimalPlaces } = getEffectiveRate();
	const converted = new Decimal(cny).mul(rate).toDP(decimalPlaces);

	return {
		symbol,
		value: converted.toFixed(decimalPlaces),
		valueRaw: converted.toNumber(),
		currencyCode: code,
		rate,
		decimalPlaces,
		originalCNY: cny,
	};
}

/**
 * Get current conversion info synchronously. Used by getListingDifference.
 */
export function getCurrentConversionInfo(): ConversionInfo {
	const { rate, symbol, code } = getEffectiveRate();
	return { rate, symbol, code };
}

/**
 * Check if the selected currency is CNY (no conversion needed).
 */
export function isSelectedCurrencyCNY(): boolean {
	return !currencyConversionEnabled || selectedCurrency === 'CNY';
}

/**
 * Get all available currencies as a sorted list with their symbols.
 */
export function getAvailableCurrencies(): { code: string; symbol: string; label: string }[] {
	const currencies: { code: string; symbol: string; label: string }[] = [];

	for (const code of Object.keys(cachedRates)) {
		const symbol = cachedSymbols[code] ?? code;
		currencies.push({ code, symbol, label: `${code} (${symbol})` });
	}

	// Sort: common currencies first, then alphabetical
	const commonSet = new Set(COMMON_CURRENCIES);
	currencies.sort((a, b) => {
		const aCommon = commonSet.has(a.code);
		const bCommon = commonSet.has(b.code);
		if (aCommon && !bCommon) return -1;
		if (!aCommon && bCommon) return 1;
		if (aCommon && bCommon) {
			return COMMON_CURRENCIES.indexOf(a.code) - COMMON_CURRENCIES.indexOf(b.code);
		}
		return a.code.localeCompare(b.code);
	});

	// Add custom currency option at the end
	currencies.push({ code: '---', symbol: '?', label: 'Custom Currency' });

	return currencies;
}

/**
 * Get the currently selected currency code.
 */
export function getSelectedCurrency(): string {
	return selectedCurrency;
}
