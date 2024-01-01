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
        }
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
}