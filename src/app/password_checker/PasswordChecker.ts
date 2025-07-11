export class PasswordChecker {
    public PasswordChecker(password: string): boolean {
        if (password.length < 8) {
            return false;
        }
        if (password === password.toUpperCase()) {
            return false; 
        }
        if (password === password.toLowerCase()) {
            return false;
        }
        return true;
    }
}