export enum PasswordErrors {
    SHORT = 'Password requires to have at least 8 characters',
    NO_LOWER_CASE = 'Password requires to have at least one lower case character',
    NO_UPPER_CASE = 'Password requires to have at least one upper case character',
    NO_NUMBER = 'Admin password requires to have at least one number'
}
export interface CheckResult {
    valid: boolean;
    reasons: PasswordErrors[];
}

export class PasswordChecker {
    public checkPassword(password: string): CheckResult {
        const reasons: PasswordErrors[] = [];
       this.checkForLength(password, reasons);
       this.checkForLowerCase(password, reasons);
       this.checkForUpperCase(password, reasons);
        return {
            valid: reasons.length < 1,
            reasons,
        }
    }

    public checkPasswordForAdmin(password: string) {
        const baseCheck = this.checkPassword(password);
        this.checkForNumber(password, baseCheck.reasons);
        return {
            valid: baseCheck.reasons.length < 1,
            reasons: baseCheck.reasons,
        }
    }

    private checkForNumber(password: string, reasons: PasswordErrors[]) {
        const regexMatchForNumber = /\d/;
        if (!regexMatchForNumber.test(password)) {
            reasons.push(PasswordErrors.NO_NUMBER)
        }
    }
    private checkForLength(password: string, reasons: PasswordErrors[]) {
        if (password.length < 8) {
            reasons.push(PasswordErrors.SHORT);
        }
    };

    private checkForUpperCase(password: string, reasons: PasswordErrors[]) {
        if (password === password.toLowerCase()) {
            reasons.push(PasswordErrors.NO_UPPER_CASE)
        }
    };

    private checkForLowerCase(password: string, reasons: PasswordErrors[]) {
        if (password === password.toUpperCase()) {
            reasons.push(PasswordErrors.NO_LOWER_CASE); 
        }
    }
}