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
