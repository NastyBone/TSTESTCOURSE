
export class StringUtils {
    public toUpperCase(args: string) {
        return args.toUpperCase();
    };
};

export function toUppercase(str: string): string {
    return str.toUpperCase();
}

export type stringInfo = {
    lowerCase: string;
    upperCase: string;
    length: number;
    characters: string[];
    extraInfo: Object | undefined;
}

export function getStringInfo(str: string): stringInfo {
    return {
        lowerCase: str.toLowerCase(),
        upperCase: str.toUpperCase(),
        length: str.length,
        characters: Array.from(str),
        extraInfo: {},
    }
}