const fs = require('fs');

const EXTERIOR_RANGES = ['(Factory New)', '(Minimal Wear)', '(Field-Tested)', '(Well-Worn)', '(Battle-Scarred)'];

const STICKER_FINISHES = ['(Holo)', '(Glitter)', '(Foil)', '(Gold)', '(Lenticular)', '(Champion)',
    '(Holo, Champion)', '(Glitter, Champion)', '(Gold, Champion)'];

const TOURNAMENTS = ['Copenhagen 2024', 'Paris 2023', 'Rio 2022', 'Antwerp 2022', 'Stockholm 2021', '2020 RMR',
    'Berlin 2019', 'Katowice 2019', 'London 2018', 'Boston 2018', 'Krakow 2017', 'Atlanta 2017', 'Cologne 2016',
    'MLG Columbus 2016', 'Cluj-Napoca 2015', 'Cologne 2015', 'Katowice 2015', 'DreamHack 2014', 'Cologne 2014',
    'Katowice 2014'];

const SKINS = ['Zeus x27', 'CZ75-Auto', 'Desert Eagle', 'Dual Berettas', 'Five-SeveN', 'Glock-18', 'P2000',
    'P250', 'R8 Revolver', 'Tec-9', 'USP-S', 'AK-47', 'AUG', 'AWP', 'FAMAS', 'G3SG1', 'Galil AR', 'M4A1-S', 'M4A4',
    'SCAR-20', 'SG 553', 'SSG 08', 'MAC-10', 'MP5-SD', 'MP7', 'MP9', 'PP-Bizon', 'P90', 'UMP-45', 'MAG-7', 'Nova',
    'Sawed-Off', 'XM1014', 'M249', 'Negev'];

/**
 * Sorts two sticker names such that:
 * - Non-Tournament Stickers < Tournament Stickers
 * - Tournament Stickers are sorted from most recent to oldest (according to appearance in TOURNAMENTS array)
 * - Stickers are sorted by their Finish (according to appearance in STICKER_FINISHES)
 * @param a - the first sticker name.
 * @param b - the second sticker name.
 * @return {number} - a negative number if a < b, 0 if a == b, otherwise a positive number.
 */
function stickerCompare(a, b) {
    // sort by tournament
    // -1 means it's not a tournament sticker (or we're missing the tournament name in TOURNAMENTS)
    const aTnI = TOURNAMENTS.findIndex(t => a.includes(t));
    const bTnI = TOURNAMENTS.findIndex(t => b.includes(t));

    if (aTnI === -1 && a.split(' | ').length > 2) {
        console.log(`Missing tournament in "${a}"?`);
    }

    if (bTnI === -1 && b.split(' | ').length > 2) {
        console.log(`Missing tournament in "${b}"?`);
    }

    if (aTnI === -1 && bTnI !== -1) {
        return -1;
    }

    if (aTnI !== -1 && bTnI === -1) {
        return 1;
    }

    if (aTnI !== -1 && bTnI !== -1 && aTnI !== bTnI) {
        return aTnI - bTnI;
    }

    // sort by sticker finish
    // -1 means it's a paper sticker
    const aFinI = STICKER_FINISHES.findIndex(f => a.includes(f));
    const bFinI = STICKER_FINISHES.findIndex(f => b.includes(f));

    if (aFinI === -1 && bFinI !== -1) {
        return -1;
    }

    if (aFinI !== -1 && bFinI === -1) {
        return 1;
    }

    if (aFinI !== bFinI) {
        return aFinI - bFinI;
    }

    // if all is equal just sort by name
    return a.localeCompare(b);
}

/**
 * Sorts two CS item name strings in the following order:
 * Skins < StatTrak Skins < Souvenir Skins < Knives & Gloves < StatTrak Knives < Stickers < Other (e.g. Graffiti, Patches, Agents etc.)
 * @param a - the first item name.
 * @param b - the second item name.
 * @return {number} - a negative number if a < b, 0 if a == b, otherwise a positive number.
 */
function itemNameCompare(a, b) {
    const aBase = a.replace('StatTrak™ ', '').replace('Souvenir ', '');
    const bBase = b.replace('StatTrak™ ', '').replace('Souvenir ', '');

    const aIsSkin = SKINS.some(s => aBase.startsWith(s));
    const bIsSkin = SKINS.some(s => bBase.startsWith(s));

    if (aIsSkin && !bIsSkin) {
        return -1;
    }

    if (!aIsSkin && bIsSkin) {
        return 1;
    }

    // sort souvenir after non-souvenir
    const aIsSouvenir = a.startsWith('Souvenir ');
    const bIsSouvenir = b.startsWith('Souvenir ');

    if (aIsSouvenir && !bIsSouvenir) {
        return 1;
    }

    if (!aIsSouvenir && bIsSouvenir) {
        return -1;
    }

    // sort special before non-skins
    const aIsSpecial = a.startsWith('★');
    const bIsSpecial = b.startsWith('★');

    if (aIsSpecial && !bIsSpecial) {
        return -1;
    }

    if (!aIsSpecial && bIsSpecial) {
        return 1;
    }

    // sort stattrak after non-stattrak
    const aIsStatTrak = a.includes('StatTrak™');
    const bIsStatTrak = b.includes('StatTrak™');

    if (aIsStatTrak && !bIsStatTrak) {
        return 1;
    }

    if (!aIsStatTrak && bIsStatTrak) {
        return -1;
    }

    const aIsSticker = a.startsWith('Sticker | ');
    const bIsSticker = b.startsWith('Sticker | ');

    // sort other after non-other
    const aIsOther = !aIsSkin && !aIsSpecial && !aIsSticker;
    const bIsOther = !bIsSkin && !bIsSpecial && !bIsSticker;

    if (aIsOther && !bIsOther) {
        return 1;
    }

    if (!aIsOther && bIsOther) {
        return -1;
    }

    // sort stickers
    if (aIsSticker && bIsSticker) {
        return stickerCompare(a, b);
    }

    const exts = EXTERIOR_RANGES.map((er, i) => ({ n: er, i: i }));
    const aExt = exts.find(e => a.includes(e.n));
    const bExt = exts.find(e => b.includes(e.n));

    // one of the items has no exterior -> sort based on item name
    if (!aExt || !bExt) {
        return a.localeCompare(b);
    }

    const ca = a.replace(aExt.n, '');
    const cb = b.replace(bExt.n, '');

    const lc = ca.localeCompare(cb);

    // check if they are two different items (independent of exterior)
    if (lc !== 0) {
        return lc;
    }

    // sort based on exterior
    return aExt.i - bExt.i;
}

async function generateBuffItemsSorted() {
    const res = await fetch('https://raw.githubusercontent.com/ModestSerhat/buff163-ids/main/buffids.json');

    if (res.ok) {
        const data = await res.json();

        const buffItems = {};

        // generate buff items
        for (const key in data) {
            let name = data[key];

            if (name.startsWith('★') && !name.includes(' | ')) {
                name += ' | (Vanilla)';
            }

            if (buffItems[name] !== undefined) {
                throw Error(name + ' already exists');
            }

            buffItems[name] = +key;
        }

        // sort buff items
        const buffItemsSorted = {};
        const sortedItems = Object.keys(buffItems).sort(itemNameCompare);

        for (const name of sortedItems) {
            buffItemsSorted[name] = buffItems[name];
        }

        // save sorted buff items
        fs.writeFileSync('./src/assets/buff-items-sorted.json', JSON.stringify(buffItemsSorted, null, 2), 'utf8');
    } else {
        throw Error(`Error ${res.status} - ${res.statusText} while fetching https://github.com/ModestSerhat/buff163-ids/blob/main/buffids.json`);
    }
}

generateBuffItemsSorted().then(_ => console.log('successfully generated buff items'));
