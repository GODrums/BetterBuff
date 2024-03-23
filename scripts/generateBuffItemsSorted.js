const fs = require('fs');

const EXTERIOR_RANGES = ['(Factory New)', '(Minimal Wear)', '(Field-Tested)', '(Well-Worn)', '(Battle-Scarred)'];

const STICKER_FINISHES = ['(Holo)', '(Glitter)', '(Foil)', '(Lenticular)', '(Gold)', '(Champion)',
    '(Holo, Champion)', '(Glitter, Champion)', '(Gold, Champion)'];

const TOURNAMENTS = ['Copenhagen 2024', 'Paris 2023', 'Rio 2022', 'Antwerp 2022', 'Stockholm 2021', '2020 RMR',
    'Berlin 2019', 'Katowice 2019', 'London 2018', 'Boston 2018', 'Krakow 2017', 'Atlanta 2017', 'Cologne 2016',
    'MLG Columbus 2016', 'Cluj-Napoca 2015', 'Cologne 2015', 'Katowice 2015', 'DreamHack 2014', 'Cologne 2014',
    'Katowice 2014'];

const SKINS = ['Zeus x27', 'CZ75-Auto', 'Desert Eagle', 'Dual Berettas', 'Five-SeveN', 'Glock-18', 'P2000',
    'P250', 'R8 Revolver', 'Tec-9', 'USP-S', 'AK-47', 'AUG', 'AWP', 'FAMAS', 'G3SG1', 'Galil AR', 'M4A1-S', 'M4A4',
    'SCAR-20', 'SG 553', 'SSG 08', 'MAC-10', 'MP5-SD', 'MP7', 'MP9', 'PP-Bizon', 'P90', 'UMP-45', 'MAG-7', 'Nova',
    'Sawed-Off', 'XM1014', 'M249', 'Negev'];

let serhatData;
const namePerBuffId = {};
const buffIdPerName = {};
const skinsData = {};
const stickersData = { 'Sticker': {} };
const othersData = {};

function toLower(obj) {
    if (typeof obj === 'object') {
        const lowerObj = {};

        for (const [key, val] of Object.entries(obj)) {
            lowerObj[key.toLowerCase()] = toLower(val);
        }

        return lowerObj;
    }

    return obj;
}

/**
 * Sorts two sticker names such that:
 * - Non-Tournament Stickers < Tournament Stickers
 * - Tournament Stickers are sorted from most recent to oldest (according to appearance in TOURNAMENTS array)
 * - Stickers are sorted by their finish (according to appearance in STICKER_FINISHES)
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
 * Sorts two skin names such that:
 * - Non-Special Skins < Special Skins (Special Skins: Knives & Gloves)
 * - Non-Souvenir < Souvenir
 * - Non-StatTrak < StatTrak
 * - Sorted by exterior: FN < MW < FT < WW < BS
 * @param a - the first skin name.
 * @param b - the second skin name.
 * @return {number} - a negative number if a < b, 0 if a == b, otherwise a positive number.
 */
function skinCompare(a, b) {
    // sort special after non-special
    const aIsSpecial = a.startsWith('★');
    const bIsSpecial = b.startsWith('★');

    if (aIsSpecial && !bIsSpecial) {
        return 1;
    }

    if (!aIsSpecial && bIsSpecial) {
        return -1;
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

    // sort stattrak after non-stattrak
    const aIsStatTrak = a.includes('StatTrak™');
    const bIsStatTrak = b.includes('StatTrak™');

    if (aIsStatTrak && !bIsStatTrak) {
        return 1;
    }

    if (!aIsStatTrak && bIsStatTrak) {
        return -1;
    }

    // if two skins are different (disregarding exterior) sort by skin name
    const aBase = EXTERIOR_RANGES.reduce((str, e) => str.replace(e, ''), a);
    const bBase = EXTERIOR_RANGES.reduce((str, e) => str.replace(e, ''), b);

    const baseCmp = aBase.localeCompare(bBase);
    if (baseCmp !== 0) {
        return baseCmp;
    }

    // sort two of the same skin by exterior
    const aExtI = EXTERIOR_RANGES.findIndex(e => a.includes(e));
    const bExtI = EXTERIOR_RANGES.findIndex(e => b.includes(e));

    if (aExtI === -1 && !a.includes('(Vanilla)')) {
        throw Error(`Skin "${a}" has no exterior`);
    }

    if (bExtI === -1 && !b.includes('(Vanilla)')) {
        throw Error(`Skin "${b}" has no exterior`);
    }

    return aExtI - bExtI;
}

/**
 * Sorts two CS item name strings in the following order:
 * Skins (incl. Knives and Gloves) < Stickers < Other (e.g. Graffiti, Patches, Agents etc.)
 * @param a - the first item name.
 * @param b - the second item name.
 * @return {number} - a negative number if a < b, 0 if a == b, otherwise a positive number.
 */
function itemCompare(a, b) {
    const aIsSkin = isSkin(a);
    const bIsSkin = isSkin(b);

    if (aIsSkin && !bIsSkin) {
        return -1;
    }

    if (!aIsSkin && bIsSkin) {
        return 1;
    }

    if (aIsSkin && bIsSkin) {
        return skinCompare(a, b);
    }

    const aIsSticker = isSticker(a);
    const bIsSticker = isSticker(b);

    if (aIsSticker && !bIsSticker) {
        return -1;
    }

    if (!aIsSticker && bIsSticker) {
        return 1;
    }

    if (aIsSticker && bIsSticker) {
        return stickerCompare(a, b);
    }

    // sort the rest just based on string comparison
    return a.localeCompare(b);
}

function isSpecialSkin(itemName) {
    return itemName.startsWith('★');
}

function isSkin(itemName) {
    const base = itemName.replace('StatTrak™ ', '').replace('Souvenir ', '');
    return isSpecialSkin(itemName) || SKINS.some(s => base.startsWith(s));
}

function isSticker(itemName) {
    return itemName.startsWith('Sticker | ');
}

function insertSkin(skin) {
    const isVanilla = skin.includes('(Vanilla)');
    const parts = skin.split(' | ');

    if (parts.length !== 2) {
        console.error(`Skin ${skin} does not have 2 parts`);
    }

    const [category, finish] = parts;

    let curObj = skinsData;

    let categoryRest = category;
    const categorySpecs = ['StatTrak™', 'Souvenir', '★'];

    while (true) {
        const catSpec = categorySpecs.find(cs => categoryRest.startsWith(cs));

        if (catSpec === undefined) {
            if (curObj[categoryRest] === undefined) {
                curObj[categoryRest] = {};
            }
            curObj = curObj[categoryRest];
            break;
        }

        if (curObj[catSpec] === undefined) {
            curObj[catSpec] = {};
        }
        curObj = curObj[catSpec];
        // plus one to also remove the whitespace
        categoryRest = categoryRest.substring(catSpec.length + 1);
    }

    if (isVanilla) {
        curObj[finish] = buffIdPerName[skin];
        return;
    }

    const exterior = EXTERIOR_RANGES.find(e => finish.endsWith(e));

    if (exterior === undefined) {
        throw Error(`Skin "${skin}" with finish "${finish}" does not have an exterior`);
    }

    const finishBase = finish.replace(exterior, '').trim();

    if (curObj[finishBase] === undefined) {
        curObj[finishBase] = {};
    }

    curObj[finishBase][exterior] = buffIdPerName[skin];
}

function insertSticker(sticker) {
    const parts = sticker.split(' | ');

    if (parts.length !== 2 && parts.length !== 3) {
        throw Error(`Sticker "${sticker}" has an unexpected number of parts`);
    }

    /*
    There are a few tournament stickers that do not have their tournament name in their third " | " part.
    These Stickers are:
     - "Sticker | ESL One Cologne 2014 (Blue)"
     - "Sticker | ESL One Cologne 2014 (Red)"
     - "Sticker | DreamHack Winter 2014"
     - "Sticker | DreamHack Winter 2014 (Foil)"

     For simplicity reasons we will treat those stickers as non-tournament stickers
     */
    const tournament = parts.length === 3 ? parts[2] : '';

    if (stickersData['Sticker'][tournament] === undefined) {
        stickersData['Sticker'][tournament] = {};
    }

    const name = parts[1];

    const finish = STICKER_FINISHES.find(sf => name.endsWith(sf)) || '';

    if (stickersData['Sticker'][tournament][finish] === undefined) {
        stickersData['Sticker'][tournament][finish] = {};
    }

    const nameBase = name.replace(finish, '').trim();

    stickersData['Sticker'][tournament][finish][nameBase] = buffIdPerName[sticker];
}

function insertOther(other) {
    const parts = other.split(' | ');

    let cur = othersData;

    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];

        if (cur[part] === undefined) {
            cur[part] = {};
        } else if (typeof cur[part] === 'number') {
            console.log(`overlap between "${other}" and "${serhatData[cur[part]]}"`);
            const val = cur[part];
            cur[part] = { '': val };
        } else if (typeof cur[part] !== 'object') {
            console.error(`unexpected structure while inserting "${other}":`, cur[part]);
            throw Error(`unexpected structure while inserting "${other}"`);
        }

        cur = cur[part];
    }

    cur[parts[parts.length - 1]] = buffIdPerName[other];
}

async function generateBuffItemsSorted() {
    const res = await fetch('https://raw.githubusercontent.com/ModestSerhat/buff163-ids/main/buffids.json');

    if (res.ok) {
        serhatData = await res.json();

        // generate buff items
        for (const key in serhatData) {
            let name = key;

            try {
                if (name.includes('  ')) {
                    throw Error(`Serhat dataset has item with double whitespace "${name}"`);
                }
            } catch (e) {
                console.error(name)
                throw Error(e);
            }

            if (isSpecialSkin(name) && !name.includes(' | ')) {
                name += ' | (Vanilla)';
            }

            if (buffIdPerName[name] !== undefined) {
                throw Error(name + ' already exists');
            }

            buffIdPerName[name] = +serhatData[key];
        }

        // sort buff items
        const sortedItems = Object.keys(buffIdPerName).sort(itemCompare);

        // create compressed buff items
        for (const name of sortedItems) {
            namePerBuffId[buffIdPerName[name]] = name;

            if (isSkin(name)) {
                insertSkin(name);
            } else if (isSticker(name)) {
                insertSticker(name);
            } else {
                insertOther(name);
            }
        }

        // save compressed buff items
        fs.writeFileSync('./src/assets/buff-ids.json', JSON.stringify(namePerBuffId, null, 2), 'utf8');
        fs.writeFileSync('./src/assets/buff-skins-sorted.json', JSON.stringify(toLower(skinsData), null, 2), 'utf8');
        fs.writeFileSync('./src/assets/buff-stickers-sorted.json', JSON.stringify(toLower(stickersData), null, 2), 'utf8');
        fs.writeFileSync('./src/assets/buff-others-sorted.json', JSON.stringify(toLower(othersData), null, 2), 'utf8');
    } else {
        throw Error(`Error ${res.status} - ${res.statusText} while fetching https://github.com/ModestSerhat/buff163-ids/blob/main/buffids.json`);
    }
}

generateBuffItemsSorted().then(_ => console.log('successfully generated buff items'));
