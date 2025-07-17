export type stringInfo = {
    lowerCase: string;
    upperCase: string;
    length: number;
    characters: string[];
    extraInfo: Object | undefined;
}

type LoggerServiceCallback = (arg: string) => void;

export function calculateStringComplexity(stringInfo: stringInfo) {
    return stringInfo.length * Object.keys(stringInfo.extraInfo).length;
}

export function toUppercaseWithCb(arg: string, callback: LoggerServiceCallback) {
    if (!arg) {
        callback('Invalid String');
        return;
    }
    callback(`Tested with string ${arg}`);
    return arg.toUpperCase();
}