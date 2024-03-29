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

const testsData = {
    include: [
        { searchTerm: 'Karambit', expectedMatches: ['★ Karambit | (Vanilla)', '★ Karambit', '★ Karambit'] },
        {
            searchTerm: 'skeleton',
            expectedMatches: ['★ Skeleton Knife | (Vanilla)', '★ Skeleton Knife', '★ Skeleton Knife'],
        },
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
    ],
    equal: [
        {
            searchTerm: 'stat trak awp neo noir field tested',
            expectedMatches: ['StatTrak™ AWP | Neo-Noir (Field-Tested)'],
        },
        {
            searchTerm: 'StatTrak™ AWP | Neo-Noir (Field-Tested)',
            expectedMatches: ['StatTrak™ AWP | Neo-Noir (Field-Tested)'],
        },
    ],
    empty: [
        { searchTerm: 'some item name that does not exist' },
    ],
};

describe('testing item name search', () => {
    test('best suggestions should include', () => {
        for (let i = 0; i < testsData.include.length; i++) {
            const { searchTerm, expectedMatches } = testsData.include[i];
            const { time, matches } = getMatches(searchTerm);

            for (let j = 0; j < matches.length && j < expectedMatches.length; j++) {
                if (!matches[j].item.includes(expectedMatches[j])) {
                    throw Error(`${i} [${searchTerm}]: match at ${j} ("${matches[j].item}") does not include "${expectedMatches[j]}".`);
                }
            }

            if (matches.length < expectedMatches.length) {
                throw Error(`${i} [${searchTerm}]: less matches (${matches.length}) than expected (${expectedMatches.length})`);
            }

            if (time > timeLimit) {
                throw Error(`${i} [${searchTerm}]: search time (${time.toFixed(2)}ms) exceeded time limit of ${timeLimit}ms.`);
            }
        }
    });

    test('suggestions should match exactly', () => {
        for (let i = 0; i < testsData.equal.length; i++) {
            const { searchTerm, expectedMatches } = testsData.equal[i];
            const { time, matches } = getMatches(searchTerm);

            for (let j = 0; j < matches.length && j < expectedMatches.length; j++) {
                if (matches[j].item !== expectedMatches[j]) {
                    throw Error(`${i} [${searchTerm}]: match at ${j} ("${matches[j].item}") does not equal "${expectedMatches[j]}".`);
                }
            }

            if (matches.length !== expectedMatches.length) {
                throw Error(`${i} [${searchTerm}]: number of matches (${matches.length}) does not equal expected (${expectedMatches.length})`);
            }

            if (time > timeLimit) {
                throw Error(`${i} [${searchTerm}]: search time (${time.toFixed(2)}ms) exceeded time limit of ${timeLimit}ms.`);
            }
        }
    });

    test('suggestions should be empty', () => {
        for (let i = 0; i < testsData.empty.length; i++) {
            const { searchTerm } = testsData.empty[i];
            const { time, matches } = getMatches(searchTerm);

            if (matches.length > 0) {
                throw Error(`${i} [${searchTerm}]: expected zero matches but found ${matches.length}: ${matches.map(m => `"${m.item}"`).join(', ')}`);
            }

            if (time > timeLimit) {
                throw Error(`${i} [${searchTerm}]: search time (${time.toFixed(2)}ms) exceeded time limit of ${timeLimit}ms.`);
            }
        }
    });
});

describe('benchmark item name search', () => {
    test('run benchmark', () => {
        const searchTerms = [];

        for (const data of Object.values(testsData)) {
            searchTerms.push(...data.map(d => d.searchTerm));
        }

        const avgTimes = searchTerms.map(_ => 0);

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < searchTerms.length; j++) {
                const { time } = getMatches(searchTerms[j]);

                avgTimes[j] = (time + i * avgTimes[j]) / (i + 1);
            }
        }

        console.log(`Benchmark Results (avg.):\n${searchTerms.map((st, i) => `\t${st}: ${avgTimes[i].toFixed(2)} ms`).join('\n')}`);
    });
});
