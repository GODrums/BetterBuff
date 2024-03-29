import commonWords from '@/assets/common-words.json';

/*
 * Contains algorithm and data structures used for Buff Item suggestions.
 * See also: https://github.com/GODrums/BetterBuff/pull/8
 *
 * Algorithm Description:
 *  Given a list of keywords, return the top-N Buff Items that match ALL the keywords.
 *
 *  - The matching is done case-insensitive
 *  - The matching is done fuzzily via "Optimal string alignment distance" (https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance#Optimal_string_alignment_distance)
 *  - For every keyword only the single best match within an item name is taken into consideration
 *  - TODO: Optimize cache performance
 */

let DEBUG = false;
let commonWordsScoreCache: any = {};
let TOTAL_SCORE_TIME = 0;
let TOTAL_CACHE_TIME = 0;
let TOTAL_STR_INDEX_TIME = 0;
let TOTAL_FUZZY_TIME = 0;

class TopNElement {
    element: any;
    score: number;

    constructor(el: any, val: number) {
        this.element = el;
        this.score = val;
    }
}

class TopNList {
    public static Less = (a: TopNElement, b: TopNElement) => a.score - b.score;
    public static Greater = (a: TopNElement, b: TopNElement) => b.score - a.score;

    private readonly N: number;

    private readonly cmp: (a: TopNElement, b: TopNElement) => number;

    // a list containing the best N elements in order
    private readonly list: TopNElement[] = [];

    constructor(N: number, cmp = TopNList.Greater) {
        if (N < 1) {
            throw Error('n must be larger than 0');
        }

        this.N = N;
        this.cmp = cmp;
    }

    public add(...elements: TopNElement[]) {
        for (const element of elements) {
            if (this.list.length === this.N && this.cmp(this.list[this.list.length - 1], element) <= 0) {
                // element is not better than anything in the list
                return;
            }

            // insert top element
            const i = branchlessBinarySearch(this.list, element, this.cmp);
            this.list.splice(i, 0, element);

            // shorten list if needed
            if (this.list.length > this.N) {
                this.list.splice(this.list.length - 1, 1);
            }
        }
    }

    public get(): ReadonlyArray<TopNElement> {
        return this.list;
    }
}

function rankObject(obj: any, keywordScores: number[], keywords: string[], topNList: TopNList) {
    for (const [key, val] of Object.entries(obj)) {
        const words = key.split(' ');

        let newKeywordScores = [...keywordScores];

        for (const word of words) {
            for (let i = 0; i < keywords.length; i++) {
                const keyword = keywords[i];

                const st = performance.now();
                const s = calcScore(word, keyword);
                TOTAL_SCORE_TIME += performance.now() - st;

                if (s > newKeywordScores[i]) {
                    // found better match for keyword
                    newKeywordScores[i] = s;
                }
            }
        }

        if (typeof val === 'number' && newKeywordScores.every(ks => ks > 0)) {
            topNList.add({ element: val, score: Math.round(newKeywordScores.reduce((sum, ks) => sum + ks, 0)) });
        } else if (typeof val === 'object') {
            rankObject(val, newKeywordScores, keywords, topNList);
        }
    }
}

export function findBestMatches(N: number, searchTerm: string, buffSkins: any, buffStickers: any, buffOthers: any, debug = false): ReadonlyArray<TopNElement> {
    DEBUG = debug;

    const st = performance.now();
    TOTAL_SCORE_TIME = 0;
    TOTAL_CACHE_TIME = 0;
    TOTAL_STR_INDEX_TIME = 0;
    TOTAL_FUZZY_TIME = 0;

    commonWordsScoreCache = {};
    for (const word of commonWords) {
        commonWordsScoreCache[word] = {};
    }

    const keywords = searchTerm.toLowerCase()
        .split(' ')
        .map(k => k.trim())
        .filter(k => k.length > 0 && k !== '|'); /* TODO: better to also match "|" if explicitly asked */

    const topNList = new TopNList(N);

    const skt = performance.now();
    rankObject(buffSkins, keywords.map(_ => 0), keywords, topNList);
    const stt = performance.now();
    rankObject(buffStickers, keywords.map(_ => 0), keywords, topNList);
    const ot = performance.now();
    rankObject(buffOthers, keywords.map(_ => 0), keywords, topNList);

    const e = performance.now();

    if (DEBUG) {
        console.log(`Total match time: ${e - st} ms`);
        console.log(`\tInit time: ${skt - st} ms`);
        console.log(`\tSkins match time: ${stt - skt} ms`);
        console.log(`\tStickers match time: ${ot - stt} ms`);
        console.log(`\tOthers match time: ${e - ot} ms`);
        console.log(`Total score time: ${TOTAL_SCORE_TIME} ms`);
        console.log(`\tTotal cache time: ${TOTAL_CACHE_TIME} ms`);
        console.log(`\tTotal string index time: ${TOTAL_STR_INDEX_TIME} ms`);
        console.log(`\tTotal fuzzy time: ${TOTAL_FUZZY_TIME} ms`);
    }

    return topNList.get();
}

/**
 * Given an item name and a list of lower-case keywords returns the item name where any occurrences of
 * the keywords (case-insensitive) is highlighted using <match> XML tags.
 * TODO: Refactor directly into search
 * @param itemName - the item name.
 * @param keywords - the keywords.
 */
export function getMatchedItemName(itemName: string, keywords: string[]): string {
    const itemNameLower = itemName.toLowerCase();
    // the set of character indices in the itemName that are part of a keyword match
    const matchedIndices: Set<number> = new Set();

    // find matching characters that are part of a keyword
    for (const keyword of keywords) {
        let i = 0;

        while (i < itemNameLower.length) {
            const nextMatch = itemNameLower.indexOf(keyword, i);

            if (nextMatch === -1) {
                break;
            }

            // add matching indices
            for (let j = 0; j < keyword.length; j++) {
                matchedIndices.add(nextMatch + j);
            }

            i = nextMatch + keyword.length;
        }
    }

    // construct matched item name string
    let matchedItemName = '';
    let isMatchingGroup = false;
    for (let i = 0; i < itemName.length; i++) {
        if (matchedIndices.has(i) && !isMatchingGroup) {
            // start a new matching group
            isMatchingGroup = true;
            matchedItemName += '<match>';
        } else if (!matchedIndices.has(i) && isMatchingGroup) {
            // end current matching group
            isMatchingGroup = false;
            matchedItemName += '</match>';
        }

        matchedItemName += itemName.charAt(i);
    }

    if (isMatchingGroup) {
        matchedItemName += '</match>';
    }

    return matchedItemName;
}

function calcScore(word: string, keyword: string): number {
    const st1 = performance.now();
    const isCommon = commonWordsScoreCache[word] !== undefined;

    if (isCommon && commonWordsScoreCache[word][keyword] !== undefined) {
        TOTAL_CACHE_TIME += performance.now() - st1;
        return commonWordsScoreCache[word][keyword];
    }

    TOTAL_CACHE_TIME += performance.now() - st1;

    let s = 0;

    const st2 = performance.now();
    const si = word.indexOf(keyword);
    TOTAL_STR_INDEX_TIME += performance.now() - st2;

    if (si === 0 && word.length === keyword.length) {
        // the word matches the keyword exactly
        s = 10;
    } else if (si === 0) {
        // the word starts with the keyword
        s = 6;
    } else if (si > 0) {
        // the word includes the keyword
        s = 4;
    } else if (keyword.length > 2) {
        // the word does not include the keyword directly
        const st3 = performance.now();
        const fuzzyDist = calcFuzzyMatchDistance(word, keyword, 2);
        TOTAL_FUZZY_TIME += performance.now() - st3;

        switch (fuzzyDist) {
            case 1:
                s = 2;
                break;
            case 2:
                s = 1;
                break;
        }
    }

    const st4 = performance.now();
    if (isCommon) {
        commonWordsScoreCache[word][keyword] = s;
    }
    TOTAL_CACHE_TIME += performance.now() - st4;

    return s;
}

/**
 * Computes the optimal string alignment distance.
 * Optimizations:
 * - Abort early if prefix distance is already larger than limit
 * TODO: Return starting and end index of fuzzy matched substring in a
 * @see https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance#Algorithm
 */
function calcFuzzyMatchDistance(a: string, b: string, limit: number) {
    if (Math.abs(a.length - b.length) > limit) {
        return limit + 1;
    }

    const d = new Array(a.length + 1);
    for (let i = 0; i < d.length; i++) {
        d[i] = new Array(b.length + 1);
    }

    for (let i = 0; i <= a.length; i++) {
        d[i][0] = i;
    }
    for (let j = 0; j <= b.length; j++) {
        d[0][j] = j;
    }

    for (let i = 1; i <= a.length; i++) {
        let abort = true;

        for (let j = 1; j <= b.length; j++) {
            const aChar = a.charAt(i - 1);
            const bChar = b.charAt(j - 1);

            let cost = aChar === bChar ? 0 : 1;

            d[i][j] = Math.min(
                d[i - 1][j] + 1, // deletion
                d[i][j - 1] + 1,        // insertion
                d[i - 1][j - 1] + cost, // substitution
            );

            if (i > 1 && j > 1 && aChar === b.charAt(j - 2) && bChar === a.charAt(i - 2)) {
                d[i][j] = Math.min(d[i][j],
                    d[i - 2][j - 2] + 1); // transposition
            }

            abort = abort && d[i][j] > limit;
        }

        if (abort) {
            d[a.length][b.length] = limit + 1;
            break;
        }
    }

    return d[a.length][b.length];
}

/**
 * Returns the index to the first element that is actually less (NOT less or equal!)
 * than the given value. If no such element exists the length of array is returned.
 * @param arr - the array to search.
 * @param val - the value to search for.
 * @param cmp - the three-way comparison function.
 */
function branchlessBinarySearch<T>(arr: T[], val: T, cmp: (a: T, B: T) => number) {
    let i = 0;
    let len = arr.length;

    while (len > 0) {
        const half = Math.floor(len / 2);
        i += cmp(arr[i + half], val) <= 0 ? len - half : 0;
        len = half;
    }

    return Math.floor(i);
}
