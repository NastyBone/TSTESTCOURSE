import { v4 } from 'uuid'

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

export function toLowerCase(arg: string){
    return arg.toLowerCase();
}

export function toUpperCaseWithId(arg: string) {
    return arg.toUpperCase() + v4();
}

export function toUppercaseWithCb(arg: string, callback: LoggerServiceCallback) {
    if (!arg) {
        callback('Invalid String');
        return;
    }
    callback(`Tested with string ${arg}`);
    return arg.toUpperCase();
}

export class OtherStringUtils {
    public toUpperCase(arg: string) {
        return arg.toUpperCase();
    };

    public logString(arg: string) {
        console.log(arg);
    };

    private callExternalService(){}
}