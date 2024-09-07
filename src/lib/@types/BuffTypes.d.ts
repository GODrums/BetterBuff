export namespace BuffTypes {
	export interface G {
		appid: number;
		captcha_id: string;
		currency: {
			code: string; // e.g. USD
			default: string; // e.g. CNY
			desc: string; // e.g. Dollar
			rate_base_cny: number; // e.g. 0.14
			rate_base_usd: number; // e.g. 1
			symbol: string; // e.g. $
		};
	}

	export namespace CommonType {
		export interface TagInfo {
			id?: unknown;
			category: string;
			internal_name: string;
			localized_name: string;
		}

		export interface Tags {
			[name: string]: TagInfo;
		}

		export interface UserInfo {
			avatar: string;
			avatar_safe: string;
			is_premium_vip?: boolean;
			is_auto_accept?: boolean;
			nickname: string;
			seller_level?: number;
			shop_id: string;
			user_id: string;
			v_types?: any;
		}

		export interface UserInfos {
			[name: string]: UserInfo;
		}

		export interface TournamentTag {
			category: string;
			internal_name: string;
			localized_name: string;
		}

		export interface MetaphysicData {
			color: string;
			name: string;
		}

		export interface Metaphysic {
			data: MetaphysicData;
			title: string;
		}

		export interface PhaseData {
			color: string;
			name: string;
		}

		export interface TierData {
			color: string;
			name: string;
		}
	}

	export namespace TooManyRequests {
		export interface Response {
			text: string; // <html><head><title>429 Too Many Requests</title></head><body><center><h1>429 Too Many Requests</h1></center><hr><center>nginx</center></body></html>
		}
	}

	export namespace CaptchaRequired {
		export interface Response {
			code: 'Captcha Validate Required';
			confirm_entry: any;
			error: string; // e.g. 访问异常, 请完成安全验证
			extra: unknown;
			target: unknown;
			target_type: string;
		}
	}

	export namespace SellOrder {
		export interface GoodsInfo {
			appid: number;
			description?: any;
			game: string;
			goods_id: number;
			icon_url: string;
			item_id?: any;
			market_hash_name: string;
			market_min_price: string;
			name: string;
			original_icon_url: string;
			short_name: string;
			steam_price: string;
			steam_price_cny: string;
			steam_price_custom: string;
			tags: CommonType.Tags;
		}

		export interface GoodsInfos {
			[id: number]: GoodsInfo;
		}

		export interface HasMarketStores {
			[name: string]: boolean;
		}

		export interface Sticker {
			category: string;
			img_url: string;
			name: string;
			slot: number;
			sticker_id: number;
			wear: number;
		}

		export interface Info {
			fraudwarnings?: any;
			icon_url: string;
			inspect_en_size: string;
			inspect_en_url: string;
			inspect_mobile_size: string;
			inspect_mobile_url: string;
			inspect_size: string;
			inspect_start_at: string;
			inspect_state: number;
			inspect_trn_size: string;
			inspect_trn_url: string;
			inspect_url: string;
			inspect_version: number;
			inspected_at: string;
			original_icon_url: string;
			paintindex: number;
			paintseed: number;
			stickers: Sticker[];
			tournament_tags: CommonType.TournamentTag[];
		}

		export interface AssetInfo {
			action_link: string;
			appid: number;
			assetid: string;
			classid: string;
			contextid: number;
			goods_id: number;
			has_tradable_cooldown: boolean;
			info: Info;
			instanceid: string;
			paintwear: string;
			tradable_cooldown_text: string;
			tradable_unfrozen_time?: any;
		}

		export interface Item {
			allow_bargain: boolean;
			appid: number;
			asset_info: AssetInfo;
			background_image_url: string;
			bookmarked: boolean;
			can_bargain: boolean;
			can_use_inspect_trn_url: boolean;
			cannot_bargain_reason: string;
			coupon_infos?: any;
			created_at: number;
			description: string;
			featured: number;
			fee: string;
			game: string;
			goods_id: number;
			id: string;
			img_src: string;
			income: string;
			lowest_bargain_price: string;
			mode: number;
			price: string;
			recent_average_duration: number | null;
			recent_deliver_rate: number | null;
			state: number;
			sticker_premium?: number; // SP
			supported_pay_methods: number[];
			tradable_cooldown?: any | null;
			updated_at: number;
			user_id: string;
		}

		export interface PreviewScreenshots {
			bg_img: string;
			selling: string;
		}

		export interface Data {
			fop_str: string;
			goods_infos: GoodsInfos;
			has_market_stores: HasMarketStores;
			items: Item[];
			page_num: number;
			page_size: number;
			preview_screenshots: PreviewScreenshots;
			sort_by: string;
			src_url_background: string;
			total_count: number;
			total_page: number;
			user_infos: CommonType.UserInfos;
		}

		export interface Response {
			code: string;
			data: Data;
			msg?: any;
		}

		export interface OrderInfo {
			allow_bargain: boolean;
			bookmarked: boolean;
			description: string;
			goods_id: number;
			id: string;
			lowest_bargain_price: string;
			mode: number;
			price: string;
			state: number;
			user_id: string;
		}
	}

	export namespace MarketGoods {
		export interface Info {
			tags: CommonType.Tags;
		}

		export interface GoodsInfo {
			icon_url: string;
			info: Info;
			item_id?: any;
			original_icon_url: string;
			steam_price: string;
			steam_price_cny: string;
		}

		export interface Item {
			appid: number;
			bookmarked: boolean;
			buy_max_price: string;
			buy_num: number;
			can_bargain: boolean;
			can_search_by_tournament: boolean;
			description?: any;
			game: string;
			goods_info: GoodsInfo;
			has_buff_price_history: boolean;
			id: number;
			market_hash_name: string;
			market_min_price: string;
			name: string;
			quick_price: string;
			sell_min_price: string;
			sell_num: number;
			sell_reference_price: string;
			short_name: string;
			steam_market_url: string;
			transacted_num: number;
		}

		export interface Data {
			items: Item[];
			page_num: number;
			page_size: number;
			total_count: number;
			total_page: number;
		}

		export interface Response {
			code: string;
			data: Data;
			msg?: any;
		}
	}

	export namespace TopBookmarked {
		export interface GoodsInfo {
			appid: number;
			can_3d_inspect: boolean;
			can_inspect: boolean;
			description?: any;
			game: string;
			goods_id: number;
			icon_url: string;
			item_id?: any;
			market_hash_name: string;
			market_min_price: string;
			name: string;
			original_icon_url: string;
			short_name: string;
			steam_price: string;
			steam_price_cny: string;
			steam_price_custom: string;
			tags: CommonType.Tags;
		}

		export interface GoodsInfos {
			[id: number]: GoodsInfo;
		}

		export interface Sticker {
			category: string;
			img_url: string;
			name: string;
			slot: number;
			sticker_id: number;
			wear: number;
		}

		export interface Info {
			fraudwarnings: string;
			icon_url: string;
			inspect_en_size: string;
			inspect_en_url: string;
			inspect_mobile_size: string;
			inspect_mobile_url: string;
			inspect_size: string;
			inspect_start_at: string;
			inspect_state: number;
			inspect_trn_size: string;
			inspect_trn_url: string;
			inspect_url: string;
			inspect_version: number;
			inspected_at: string;
			original_icon_url: string;
			paintindex: number;
			paintseed: number;
			stickers: Sticker[];
			tournament_tags: CommonType.TournamentTag[];
			metaphysic: CommonType.Metaphysic;
			phase_data: CommonType.PhaseData;
		}

		export interface AssetInfo {
			action_link: string;
			appid: number;
			assetid: string;
			classid: string;
			contextid: number;
			goods_id: number;
			has_tradable_cooldown: boolean;
			info: Info;
			instanceid: string;
			paintwear: string;
			tradable_cooldown_text: string;
			tradable_unfrozen_time?: any;
		}

		export interface CouponInfo {
			cdkey_id: string;
			cdkey_text: string;
			coupon_type: string;
		}

		export interface Item {
			allow_bargain: boolean;
			appid: number;
			asset_info: AssetInfo;
			can_bargain: boolean;
			cannot_bargain_reason: string;
			coupon_infos: CouponInfo[];
			created_at: number;
			description: string;
			featured: number;
			fee: string;
			game: string;
			goods_id: number;
			id: string;
			income: string;
			lowest_bargain_price: string;
			mode: number;
			price: string;
			recent_average_duration?: any;
			recent_deliver_rate?: any;
			state: number;
			tradable_cooldown?: any;
			updated_at: number;
			user_id: string;
		}

		export interface Data {
			goods_infos: GoodsInfos;
			items: Item[];
			page_num: number;
			page_size: number;
			show_game_cms_icon: boolean;
			total_count: number;
			total_page: number;
			user_infos: CommonType.UserInfos;
		}

		export interface Response {
			code: string;
			data: Data;
			msg?: any;
		}
	}

	export namespace TopPopular {
		export interface Custom {
			category: string;
			id: number;
			internal_name: string;
			localized_name: string;
		}

		export interface GoodsInfo {
			appid: number;
			can_3d_inspect: boolean;
			can_inspect: boolean;
			description?: any;
			game: string;
			goods_id: number;
			icon_url: string;
			item_id?: any;
			market_hash_name: string;
			market_min_price: string;
			name: string;
			original_icon_url: string;
			short_name: string;
			steam_price: string;
			steam_price_cny: string;
			tags: CommonType.Tags;
		}

		export interface GoodsInfos {
			[id: number]: GoodsInfo;
		}

		export interface Sticker {
			category: string;
			img_url: string;
			name: string;
			slot: number;
			sticker_id: number;
			wear: number;
		}

		export interface Info {
			fraudwarnings: string;
			icon_url: string;
			inspect_en_size: string;
			inspect_en_url: string;
			inspect_mobile_size: string;
			inspect_mobile_url: string;
			inspect_size: string;
			inspect_start_at: string;
			inspect_state: number;
			inspect_trn_size: string;
			inspect_trn_url: string;
			inspect_url: string;
			inspect_version: number;
			inspected_at: string;
			metaphysic: CommonType.Metaphysic;
			original_icon_url: string;
			paintindex: number;
			paintseed: number;
			stickers: Sticker[];
			tier_data: CommonType.TierData;
			tournament_tags: CommonType.TournamentTag[];
			phase_data: CommonType.PhaseData;
		}

		export interface AssetInfo {
			action_link: string;
			appid: number;
			assetid: string;
			classid: string;
			contextid: number;
			goods_id: number;
			has_tradable_cooldown: boolean;
			info: Info;
			instanceid: string;
			paintwear: string;
			tradable_cooldown_text: string;
			tradable_unfrozen_time?: any;
		}

		export interface CouponInfo {
			cdkey_id: string;
			cdkey_text: string;
			coupon_type: string;
		}

		export interface Item {
			allow_bargain: boolean;
			appid: number;
			asset_info: AssetInfo;
			background_image_url: string;
			can_bargain: boolean;
			can_use_inspect_trn_url: boolean;
			cannot_bargain_reason: string;
			coupon_infos: CouponInfo[];
			created_at: number;
			description: string;
			featured: number;
			fee: string;
			game: string;
			goods_id: number;
			id: string;
			img_src: string;
			income: string;
			lowest_bargain_price: string;
			mode: number;
			price: string;
			recent_average_duration?: any;
			recent_deliver_rate?: any;
			state: number;
			sticker_premium: number | null;
			tradable_cooldown?: any;
			updated_at: number;
			user_id: string;
		}

		export interface PreviewScreenshots {
			bg_img: string;
			top_bookmark: string;
		}

		export interface Data {
			fop_str: string;
			goods_infos: GoodsInfos;
			has_market_stores?: CommonType.HasMarketStores;
			items: Item[];
			page_num: number;
			page_size: number;
			preview_screenshots?: PreviewScreenshots;
			show_game_cms_icon?: boolean;
			show_pay_method_icon?: boolean;
			src_url_background?: string;
			total_count: number;
			total_page: number;
			user_infos: CommonType.UserInfos;
		}

		export interface Response {
			code: string;
			data: Data;
			msg?: any;
		}
	}

	export namespace BuyOrder {
		export interface Item {
			allow_tradable_cooldown: number;
			appid: number;
			created_at: number;
			fee: string;
			frozen_amount: string;
			frozen_num: number;
			game: string;
			goods_id: number;
			icon_url: string;
			id: string;
			num: number;
			pay_method: number;
			price: string;
			real_num: number;
			specific: any[];
			state: string;
			state_text: string;
			tradable_cooldown?: any;
			updated_at: number;
			user_id: string;
		}

		export interface Data {
			items: Item[];
			page_num: number;
			page_size: number;
			total_count: number;
			total_page: number;
			user_infos: CommonType.UserInfos;
		}

		export interface Response {
			code: string;
			data: Data;
			msg?: any;
		}
	}

	export namespace ShopSellOrder {
		export interface GoodsInfo {
			appid: number;
			can_3d_inspect: boolean;
			can_inspect: boolean;
			description?: any;
			game: string;
			goods_id: number;
			icon_url: string;
			item_id?: any;
			market_hash_name: string;
			market_min_price: string;
			name: string;
			original_icon_url: string;
			short_name: string;
			steam_price: string;
			steam_price_cny: string;
			tags: CommonType.Tags;
		}

		export interface GoodsInfos {
			[id: string]: GoodsInfo;
		}

		export interface Sticker {
			category: string;
			img_url: string;
			name: string;
			slot: number;
			sticker_id: number;
			wear: number;
		}

		export interface Info {
			fraudwarnings: string;
			icon_url: string;
			inspect_en_size: string;
			inspect_en_url: string;
			inspect_mobile_size: string;
			inspect_mobile_url: string;
			inspect_size: string;
			inspect_start_at: string;
			inspect_state: number;
			inspect_trn_size: string;
			inspect_trn_url: string;
			inspect_url: string;
			inspect_version: number;
			inspected_at: string;
			original_icon_url: string;
			paintindex: number;
			paintseed: number;
			stickers: Sticker[];
			tournament_tags: CommonType.TournamentTag[];
		}

		export interface AssetInfo {
			action_link: string;
			appid: number;
			assetid: string;
			classid: string;
			contextid: number;
			goods_id: number;
			has_tradable_cooldown: boolean;
			info: Info;
			instanceid: string;
			paintwear: string;
			tradable_cooldown_text: string;
			tradable_unfrozen_time?: any;
		}

		export interface Item {
			allow_bargain: boolean;
			appid: number;
			asset_info: AssetInfo;
			background_image_url: string;
			can_bargain: boolean;
			can_use_inspect_trn_url: boolean;
			cannot_bargain_reason: string;
			coupon_infos?: any;
			created_at: number;
			description: string;
			featured: number;
			fee: string;
			game: string;
			goods_id: number;
			id: string;
			img_src: string;
			income: string;
			lowest_bargain_price: string;
			mode: number;
			price: string;
			recent_average_duration?: any;
			recent_deliver_rate?: any;
			state: number;
			supported_pay_methods: number[];
			tradable_cooldown?: any;
			updated_at: number;
			user_id: string;
		}

		export interface PreviewScreenshots {
			bg_img: string;
			top_bookmark: string;
		}

		export interface Data {
			brief_info: string;
			fop_str: string;
			game: string;
			goods_infos: GoodsInfos;
			items: Item[];
			mode?: any;
			page_num: number;
			page_size: number;
			preview_screenshots: PreviewScreenshots;
			show_game_cms_icon: boolean;
			src_url_background: string;
			total_amount: string;
			total_count: number;
			total_page: number;
			user_infos: CommonType.UserInfos;
		}

		export interface Response {
			code: string;
			data: Data;
			msg?: any;
		}
	}

	export namespace ShopBillOrder {
		export interface GoodsInfo {
			appid: number;
			description?: any;
			game: string;
			goods_id: number;
			icon_url: string;
			item_id?: any;
			market_hash_name: string;
			market_min_price: string;
			name: string;
			original_icon_url: string;
			short_name: string;
			steam_price: string;
			steam_price_cny: string;
			tags: CommonType.Tags;
		}

		export interface GoodsInfos {
			[id: string]: GoodsInfo;
		}

		export interface Info {
			fraudwarnings?: any;
			icon_url: string;
			inspect_en_size: string;
			inspect_en_url: string;
			inspect_mobile_size: string;
			inspect_mobile_url: string;
			inspect_size: string;
			inspect_start_at: string;
			inspect_state: number;
			inspect_trn_size: string;
			inspect_trn_url: string;
			inspect_url: string;
			inspect_version: number;
			inspected_at: string;
			original_icon_url: string;
			paintindex: number;
			paintseed: number;
			stickers: any[];
			tournament_tags: any[];
			metaphysic: CommonType.Metaphysic;
			phase_data: CommonType.PhaseData;
		}

		export interface AssetInfo {
			action_link: string;
			appid: number;
			assetid: string;
			classid: string;
			contextid: number;
			goods_id: number;
			has_tradable_cooldown: boolean;
			id: string;
			info: Info;
			instanceid: string;
			paintwear: string;
			tradable_cooldown_text: string;
			tradable_unfrozen_time: number;
		}

		export interface Item {
			appid: number;
			asset_info: AssetInfo;
			bundle_info: unknown;
			buyer_cancel_timeout?: any;
			buyer_cookie_invalid: boolean;
			buyer_id: string;
			buyer_pay_time: number;
			buyer_send_offer_timeout: number;
			can_replace_asset: boolean;
			coupon_info?: any;
			coupon_infos?: any;
			created_at: number;
			deliver_expire_timeout: number;
			error_text?: any;
			fail_confirm?: any;
			fee: string;
			game: string;
			goods_id: number;
			has_bargain: boolean;
			has_sent_offer: boolean;
			id: string;
			income: string;
			is_seller_asked_to_send_offer: boolean;
			mode: number;
			original_price?: any;
			pay_expire_timeout: number;
			pay_method: number;
			pay_method_text: string;
			price: string;
			receive_expire_timeout: number;
			sell_order_id?: any;
			seller_can_cancel: boolean;
			seller_cookie_invalid: boolean;
			seller_id: string;
			trade_offer_trace_url?: any;
			trade_offer_url?: any;
			tradeofferid?: any;
			transact_time: number;
			type: number;
			updated_at: number;
		}

		export interface Data {
			goods_infos: GoodsInfos;
			items: Item[];
			user_infos: CommonType.UserInfo;
		}

		export interface Response {
			code: string;
			data: Data;
			msg?: any;
		}
	}

	export namespace ShopFeatured {
		export interface GoodsInfo {
			appid: number;
			description?: any;
			game: string;
			goods_id: number;
			icon_url: string;
			item_id?: any;
			market_hash_name: string;
			market_min_price: string;
			name: string;
			original_icon_url: string;
			short_name: string;
			steam_price: string;
			steam_price_cny: string;
			tags: CommonType.Tags;
		}

		export interface GoodsInfos {
			[id: string]: GoodsInfo;
		}

		export interface Sticker {
			category: string;
			img_url: string;
			name: string;
			slot: number;
			sticker_id: number;
			wear: number;
		}

		export interface Info {
			fraudwarnings?: any;
			icon_url: string;
			inspect_en_size: string;
			inspect_en_url: string;
			inspect_mobile_size: string;
			inspect_mobile_url: string;
			inspect_size: string;
			inspect_start_at: string;
			inspect_state: number;
			inspect_trn_size: string;
			inspect_trn_url: string;
			inspect_url: string;
			inspect_version: number;
			inspected_at: string;
			original_icon_url: string;
			paintindex: number;
			paintseed: number;
			stickers: Sticker[];
			tournament_tags: CommonType.TournamentTag[];
		}

		export interface AssetInfo {
			action_link: string;
			appid: number;
			assetid: string;
			classid: string;
			contextid: number;
			goods_id: number;
			has_tradable_cooldown: boolean;
			id: string;
			info: Info;
			instanceid: string;
			paintwear: string;
			tradable_cooldown_text: string;
			tradable_unfrozen_time?: any;
		}

		export interface Item {
			allow_bargain: boolean;
			appid: number;
			asset_info: AssetInfo;
			coupon_infos?: any;
			created_at: number;
			description: string;
			featured: number;
			fee: string;
			game: string;
			goods_id: number;
			id: string;
			income: string;
			lowest_bargain_price: string;
			mode: number;
			price: string;
			recent_average_duration?: any;
			recent_deliver_rate?: any;
			state: number;
			tradable_cooldown?: any;
			updated_at: number;
			user_id: string;
		}

		export interface Data {
			goods_infos: GoodsInfos;
			items: Item[];
			user_infos: CommonType.UserInfos;
		}

		export interface Response {
			code: string;
			data: Data;
			msg?: any;
		}
	}

	export namespace ItemDescDetail {
		export interface Description {
			app_data:
				| ''
				| {
						def_index: string;
						is_item_name: string;
				  };
			sticker_info?: (string | string[])[];
			color?: string;
			type: string;
			value: string;
		}

		export interface Data {
			bookmarked: boolean;
			content_pic: string;
			cs2_inspect_info: any;
			csgo_inspect_allowed: boolean;
			csgo_paintwear_allowed: boolean;
			csgo_paintwear_load_success: boolean;
			descriptions: Description[];
			fade_name: string | null;
			fraudwarnings: any;
			ice_fire_name: any;
			phase_color: any;
			phase_name: any;
			pic_with_bg: boolean;
			qr_code_url: string;
			rank: any;
			rank_order_type: any;
			seller: CommonType.UserInfo;
			seller_stats: {
				7: SellerStats<7>;
				30: SellerStats<30>;
			};
			show_game_cms_icon: boolean;
			stats?: {
				bargain_count: number;
				bookmark_count: number;
				view_count: number;
			}; // requires premium
			steam_asset_info: SteamAssetInfo;
		}

		export interface SteamAssetInfo {
			fraudwarnings: any;
			game_release_date: string;
			icon_url: string;
			inspect_en_size: string | null;
			inspect_en_url: string | null;
			inspect_mobile_size: string | null;
			inspect_mobile_url: string | null;
			inspect_preview_size: string | null;
			inspect_preview_url: string | null;
			inspect_size: string | null;
			inspect_start_at: string | null;
			inspect_state: number;
			inspect_trn_size: string | null;
			inspect_trn_url: string | null;
			inspect_url: string | null;
			inspect_version: string;
			inspected_at: string | null;
			is_cs2: boolean;
			original_inspect_url: string | null;
			paintindex: number;
			paintseed: number;
			stickers: Sticker[];
			tournament_tags: CommonType.TournamentTag[];
			version: number;
		}

		export interface Sticker {
			category: string;
			category_name: string;
			goods_id: number;
			img_url: string;
			name: string;
			sell_reference_price: string;
			slot: number;
			sticker_id: number;
			sticker_name: string;
			tag_id: number;
			wear: number;
		}

		export interface SellerStats<T extends number> {
			amount_success: number;
			average_duration: any;
			count_fail: number;
			count_success: number;
			deliver_rate: any;
			formatted_average_duration: string;
			formatted_count_success: string;
			formatted_deliver_rate: string;
			past_days: T;
		}

		export interface Response {
			code: string;
			data: Data;
			msg?: any;
		}
	}

	export namespace PriceHistory {
		export interface Data {
			currency: string;
			currency_symbol: string;
			days: 7 | 30 | 180;
			price_history: [number, number][];
			price_type: 'Steam price' | 'BUFF price';
			steam_price_currency: string;
		}

		export interface Response {
			code: string;
			data: Data;
			msg?: any;
		}
	}

	// https://buff.163.com/api/market/bundle_overview
	export namespace BundleOverview {
		export interface Info {
			fraudwarnings: any;
			icon_url: string;
			original_icon_url: string;
			stickers: any[];
			tournament_tags: any[];
		}

		export interface GoodsInfo {
			appid: number;
			description?: any;
			game: string;
			goods_id: number;
			icon_url: string;
			item_id?: any;
			market_hash_name: string;
			market_min_price: string;
			name: string;
			original_icon_url: string;
			short_name: string;
			steam_price: string;
			steam_price_cny: string;
			steam_price_custom: string;
			tags: CommonType.Tags;
		}

		export interface AssetInfo {
			appid: number;
			description?: any;
			game: string;
			goods_id: number;
			icon_url: string;
			item_id: string | null;
			market_hash_name: string;
			market_min_price: string;
			name: string;
			original_icon_url: string;
			sell_min_price: string;
			sell_reference_price: string;
			short_name: string;
			steam_price: string;
			steam_price_cny: string;
			tags: CommonType.Tags;
		}

		export interface Item {
			asset_info: AssetInfo;
			total_count: number;
		}

		export interface Data {
			allow_bargain: boolean;
			allow_bargain_chat: boolean;
			appid: number;
			asset_count: number;
			asset_info: AssetInfo;
			coupon_infos: any[];
			created_at: number;
			description: string;
			discount_rate: number;
			featured: number;
			fee: string;
			fold_asset_count: any;
			fold_unique_key: any;
			game: string;
			goods_id: number;
			goods_infos: {
				[id: number]: GoodsInfo;
			};
			id: string;
			income: string;
			is_same_goods: boolean;
			items: Item[];
			lowest_bargain_price: string;
			mode: number;
			price: string;
			recent_average_duration: number | null;
			recent_deliver_rate: number | null;
			state: number;
			sticker_premium?: number; // SP
			tradable_cooldown?: any | null;
			unit_price: string;
			updated_at: number;
			user_id: string;
		}

		export interface Response {
			code: string;
			data: Data;
			msg?: any;
		}
	}

	// https://buff.163.com/api/market/goods/bundle_inventory?
	export namespace BundleInventory {
		export interface Info {
			fraudwarnings: any;
			icon_url: string;
			original_icon_url: string;
			stickers: any[];
			tournament_tags: any[];
		}

		export interface GoodsInfo {
			appid: number;
			description?: any;
			game: string;
			goods_id: number;
			icon_url: string;
			item_id?: any;
			market_hash_name: string;
			market_min_price: string;
			name: string;
			original_icon_url: string;
			short_name: string;
			steam_price: string;
			steam_price_cny: string;
			steam_price_custom: string;
			tags: CommonType.Tags;
		}

		export interface AssetInfo {
			action_link: string;
			appid: number;
			assetid: string;
			classid: string;
			contextid: number;
			goods_id: number;
			has_tradable_cooldown: boolean;
			id: string;
			info: Info;
			instanceid: string;
			paintwear: string;
			tradable_cooldown_text: string;
			tradeable_unfrozen_time: number | null;
		}

		export interface Item {
			allow_bargain: boolean;
			allow_bargain_chat: boolean;
			appid: number;
			asset_count: number;
			asset_info: AssetInfo;
			coupon_infos: any[];
			created_at: number;
			description: string;
			discount_rate: number;
			featured: number;
			fee: string;
			game: string;
			goods_id: number;
			id: string;
			income: string;
			lowest_bargain_price: string;
			mode: number;
			paintwear: string;
			preview_asset_infos: AssetInfo[];
			price: string;
			recent_average_duration: number | null;
			recent_deliver_rate: number | null;
			reference_price: string;
			state: number;
			steam_asset_ids: number[];
			sticker_premium?: number;
			supported_pay_methods: number[];
			tradable_cooldown?: any;
			unit_price: string;
			updated_at: number;
			user_id: string;
		}

		export interface Data {
			goods_infos: {
				[id: number]: GoodsInfo;
			};
			has_market_stores: {
				[userid: string]: boolean;
			};
			items: Item[];
			page_num: number;
			page_size: number;
			show_pay_method_icon: boolean;
			total_count: number;
			total_page: number;
			user_infos: CommonType.UserInfos;
		}

		export interface Response {
			code: string;
			data: Data;
			msg?: any;
		}
	}
}
