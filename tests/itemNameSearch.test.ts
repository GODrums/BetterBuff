import buffItems from '@/assets/buff-ids.json';
import buffSkins from '@/assets/buff-skins-sorted.json';
import buffStickers from '@/assets/buff-stickers-sorted.json';
import buffOthers from '@/assets/buff-others-sorted.json';
import { findBestMatches } from '@/lib/util/itemSuggestion';

function getMatches(searchTerm: string) {
    const ts = performance.now();

    const matches = findBestMatches(10, searchTerm, buffSkins, buffStickers, buffOthers)
        .map(({ element, score }) => ({
            item: buffItems[element as keyof typeof buffItems],
            score,
        }));

    return {
        time: performance.now() - ts,
        matches: matches,
    };
}

// TODO: 100
const timeLimit = 1000;

describe('testing item name search', () => {
    test('best suggestions should include', () => {
        const includeTests = [
            { searchTerm: 'Karambit', expectedMatches: ['★ Karambit | (Vanilla)', '★ Karambit', '★ Karambit'] },
            // TODO: { searchTerm: '100thieves', expectedMatches: ['100 Thieves'] },
            {
                searchTerm: 'Neo Noir',
                expectedMatches: ['Music Kit | Tim Huling, Neo Noir', 'Music Kit | Tim Huling, Neo Noir', 'Neo-Noir'],
            },
            {
                searchTerm: 'm4 Neo Noir',
                expectedMatches: ['M4A4 | Neo-Noir'],
            },
            { searchTerm: 'chanticos fire m4', expectedMatches: ['M4A1-S | Chantico\'s Fire'] },
            {
                searchTerm: 'ak neon rider fac',
                expectedMatches: ['AK-47 | Neon Rider (Factory New)', 'StatTrak™ AK-47 | Neon Rider (Factory New)'],
            },
        ];

        for (let i = 0; i < includeTests.length; i++) {
            const { searchTerm, expectedMatches } = includeTests[i];
            const { time, matches } = getMatches(searchTerm);

            for (let j = 0; j < matches.length && j < expectedMatches.length; j++) {
                if (!matches[j].item.includes(expectedMatches[j])) {
                    throw Error(`${i}: match at ${j} ("${matches[j].item}") does not include "${expectedMatches[j]}".`);
                }
            }

            if (matches.length < expectedMatches.length) {
                throw Error(`${i}: less matches (${matches.length}) than expected (${expectedMatches.length})`);
            }

            if (time > timeLimit) {
                throw Error(`${i}: search time (${time.toFixed(2)}ms) exceeded time limit of ${timeLimit}ms.`);
            }
        }
    });

    test('suggestions should match exactly', () => {
        const equalTests = [
            {
                searchTerm: 'stat trak awp neo noir field tested',
                expectedMatches: ['StatTrak™ AWP | Neo-Noir (Field-Tested)'],
            },
            {
                searchTerm: 'StatTrak™ AWP | Neo-Noir (Field-Tested)',
                expectedMatches: ['StatTrak™ AWP | Neo-Noir (Field-Tested)'],
            },
        ];

        for (let i = 0; i < equalTests.length; i++) {
            const { searchTerm, expectedMatches } = equalTests[i];
            const { time, matches } = getMatches(searchTerm);

            for (let j = 0; j < matches.length && j < expectedMatches.length; j++) {
                if (matches[j].item !== expectedMatches[j]) {
                    throw Error(`${i}: match at ${j} ("${matches[j].item}") does not equal "${expectedMatches[j]}".`);
                }
            }

            if (matches.length !== expectedMatches.length) {
                throw Error(`${i}: number of matches (${matches.length}) does not equal expected (${expectedMatches.length})`);
            }

            if (time > timeLimit) {
                throw Error(`${i}: search time (${time.toFixed(2)}ms) exceeded time limit of ${timeLimit}ms.`);
            }
        }
    });

    test('suggestions should be empty', () => {
        const equalTests = [
            { searchTerm: 'some item name that does not exist' },
        ];

        for (let i = 0; i < equalTests.length; i++) {
            const { searchTerm } = equalTests[i];
            const { time, matches } = getMatches(searchTerm);

            if (matches.length > 0) {
                throw Error(`${i}: expected zero matches but found ${matches.length}: ${matches.map(m => `"${m.item}"`).join(', ')}`);
            }

            if (time > timeLimit) {
                throw Error(`${i}: search time (${time.toFixed(2)}ms) exceeded time limit of ${timeLimit}ms.`);
            }
        }
    });
});
