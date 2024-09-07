import { CSFloatSchema } from "./globals";

export namespace SchemaHelpers {
	export function getInspectCode(
		schema: WeaponSchema,
		paintIndex: number,
		paintSeed: number,
		paintWear: string,
		stickers: { slot: number; sticker_id: number; wear?: number }[],
		statTrak?: boolean
	) {
		if (schema?.type === "Gloves") {
			// !gengl weapon_id paint_id pattern float
			return `!gengl ${schema.id} ${paintIndex} ${paintSeed} ${paintWear}`;
		}
		// !gen weapon_id paint_id pattern float sticker1 wear1...
		let gen = `!gen ${schema.id} ${paintIndex} ${paintSeed} ${paintWear}`;
		if (stickers?.length > 0 || statTrak) {
			const str_stickers: string[] = ["0 0", "0 0", "0 0", "0 0"];
			for (const l_sticker of stickers) {
				str_stickers[l_sticker.slot] = `${l_sticker.sticker_id} ${l_sticker.wear ?? 0}`;
			}
			gen += ` ${str_stickers.join(" ")}`;
		}
		if (statTrak) {
			gen += " 0 0 1 0";
		}
		return gen;
	}

	export interface WeaponSchema {
		id: number;
		name: string;
		sticker_amount: number;
		type: string;
		paints: WeaponPaint[];
	}

	interface WeaponPaint {
		min: number;
		max: number;
		rarity: number;
		name: string;
		collection: string;
		souvenir: boolean;
		id: number;
		weapon_id: number;
	}

	export function getWeaponSchema(name: string, isVanilla?: boolean): WeaponSchema | undefined {
		const nameParts = name.split(" | ");
		const weapon = nameParts[0].includes("M9 Bayonet")
			? CSFloatSchema.weapons[39]
			: CSFloatSchema.weapons.find((weapon) => {
					return nameParts[0].indexOf(weapon.name) > -1;
			  });

		const result: WeaponSchema | undefined = weapon as unknown as WeaponSchema;

		if (!result) return undefined;
		if (nameParts.length === 1 && isVanilla) {
			if (weapon?.paints?.[0].name === "Vanilla") {
				result.paints = [weapon?.paints[0] as unknown as WeaponPaint];
			}
		} else {
			console.log(nameParts[1], weapon?.paints);
			result.paints = weapon?.paints?.filter((paint) => {
				return nameParts[1].startsWith(paint.name);
			}) as unknown as WeaponPaint[];
		}
		return result;
	}

	export function getFloatDBCategory(quality: string) {
		switch (quality) {
			case "strange":
			case "unusual_strange":
				return "2";
			case "tournament":
				return "3";
			default:
				return "1";
		}
	}
}
