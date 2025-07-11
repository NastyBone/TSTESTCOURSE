export enum PasswordErrors {
    SHORT = 'Password requires to have at least 8 characters',
    NO_LOWER_CASE = 'Password requires to have at leas one lower case character',
    NO_UPPER_CASE = 'Password requires to have at leas one upper case character',
}
export interface CheckResult {
    valid: boolean;
    reasons: PasswordErrors[];
}

export class PasswordChecker {
    public PasswordChecker(password: string): CheckResult {
        const reasons: PasswordErrors[] = [];
        if (password.length < 8) {
            reasons.push(PasswordErrors.SHORT);
        }
        if (password === password.toUpperCase()) {
            reasons.push(PasswordErrors.NO_LOWER_CASE); 
        }
        if (password === password.toLowerCase()) {
            reasons.push(PasswordErrors.NO_UPPER_CASE)
        }
        return {
            valid: reasons.length < 1,
            reasons,
        }
    }
}