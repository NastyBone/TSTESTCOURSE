export type stringInfo = {
    lowerCase: string;
    upperCase: string;
    length: number;
    characters: string[];
    extraInfo: Object | undefined;
}

export function calculateStringComplexity(stringInfo: stringInfo) {
    return stringInfo.length * Object.keys(stringInfo.extraInfo).length;
}