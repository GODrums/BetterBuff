const fs = require('fs');

const EXTERIOR_RANGES = [
    'Factory New',
    'Minimal Wear',
    'Field-Tested',
    'Well-Worn',
    'Battle-Scarred',
];

function itemNameCompare(a, b) {
    // sort non-special before special
    const aSp = a.startsWith('★');
    const bSp = b.startsWith('★');

    if (aSp && !bSp) {
        return 1;
    }

    if (!aSp && bSp) {
        return -1;
    }

    // sort non-stattrak before stattrak
    const aSt = a.includes('StatTrak™');
    const bSt = b.includes('StatTrak™');

    if (aSt && !bSt) {
        return 1;
    }

    if (!aSt && bSt) {
        return -1;
    }

    const exts = EXTERIOR_RANGES.map((er, i) => ({ n: er, i: i }));
    const aExt = exts.find(e => a.includes(e.n));
    const bExt = exts.find(e => b.includes(e.n));

    if (!aExt || !bExt) {
        return a.localeCompare(b);
    }

    const ca = a.replace(aExt.n, '');
    const cb = b.replace(bExt.n, '');

    const lc = ca.localeCompare(cb);

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
