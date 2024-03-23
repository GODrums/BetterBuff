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

function rankObject(obj: any, objScore: number, keywords: string[], keywordsLeft: number, topNList: TopNList) {
    for (const [key, val] of Object.entries(obj)) {
        const [keyScore, curKeywordsLeft] = score(key, keywords, keywordsLeft);
        const curScore = keyScore + objScore;

        if (typeof val === 'number' && curKeywordsLeft === 0) {
            topNList.add({ element: val, score: curScore });
        } else if (typeof val === 'object') {
            rankObject(val, curScore, keywords, curKeywordsLeft, topNList);
        }
    }
}

export function findBestMatches(N: number, keywords: string[], buffSkins: any, buffStickers: any, buffOthers: any): ReadonlyArray<TopNElement> {
    const topNList = new TopNList(N);

    const allMissing = (1 << (keywords.length)) - 1;

    rankObject(buffSkins, 0, keywords, allMissing, topNList);
    rankObject(buffStickers, 0, keywords, allMissing, topNList);
    rankObject(buffOthers, 0, keywords, allMissing, topNList);

    return topNList.get();
}

/**
 * Given an item name and a list of lower-case keywords returns the item name where any occurrences of
 * the keywords (case-insensitive) is highlighted using <match> XML tags.
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

function score(word: string, keywords: string[], keywordsLeft: number): [number, number] {
    let s = 0;
    let f = keywordsLeft;

    for (let i = 0; i < keywords.length; i++) {
        const keyword = keywords[i];
        if (word.startsWith(keyword)) {
            s += 1.5;
            f = unsetFlag(f, i);
        } else if (word.includes(keyword)) {
            s += 1;
            f = unsetFlag(f, i);
        }
    }

    return [s, f];
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

function checkFlag(f: number, i: number): boolean {
    return !!(f >> i);
}

function setFlag(f: number, i: number) {
    return f | (1 << i);
}

function unsetFlag(f: number, i: number) {
    return f & ~(1 << i);
}

function clearFlag(f: number) {
    return 0;
}
