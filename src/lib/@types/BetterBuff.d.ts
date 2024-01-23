export namespace BetterBuff {
    export interface URLState {
        path: string,
        search: string,
        hash: string
    }

    export interface CHPatterns {
        [weapon: string]: {
            "playside": {
                [pattern: string]: number
            },
            "backside": {
                [pattern: string]: number
            },
        }
    }
}